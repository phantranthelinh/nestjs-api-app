import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//* like express ? yes
/*
 * How to generate a module:
 * nest g module "module name"
 * we have 2 entities: User and note, 1 User can write many notes
 * - controller is where to receive request from client
 * - controller will can services to do implementation
 * prisma = dependency which connect to db using ORM ( Object Relation Management)
 * Now add a module named "prisma"
 *
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //*add middleware HERE!

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
