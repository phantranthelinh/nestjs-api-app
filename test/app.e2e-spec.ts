import * as pactum from 'pactum';
//*make a database for testing!
//*Everytime we run tests, clean up data
//*we must call requests like we do with postman
import { PrismaService } from './../src/prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
const PORT = 3002;
describe('App EndToEnd tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = appModule.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    app.listen(PORT);
    prismaService = app.get(PrismaService);
    await prismaService.cleanDatabase();
    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
  });

  describe('test authentication', () => {
    describe('Register', () => {
      it('should show error with empty email', async () => {
        return await pactum
          .spec()
          .post(`/auth/register`)
          .withBody({
            email: 'test@gmail.com',
            password: 'a123456',
          })
          .expectStatus(200);
      });
    });

    describe('Login', () => {
      it('should login', async () => {
        return await pactum
          .spec()
          .post(`/auth/login`)
          .withBody({
            email: 'test@gmail.com',
            password: 'a123456',
          })
          .expectStatus(201)
          .stores('accessToken', 'data.accessToken');
      });
    });

    describe('User', () => {
      describe('Get detail user', () => {
        it('should get detail user', async () => {
          return await pactum
            .spec()
            .get(`/users/me`)
            .withBearerToken('$S{accessToken}')
            .expectStatus(200)
            .stores('accessToken', 'accessToken');
        });
      });
    });
  });

  describe('Note', () => {
    describe('Insert Note', () => {});

    describe('Get all notes', () => {});
  });

  afterAll(async () => {
    app.close();
  });
});
