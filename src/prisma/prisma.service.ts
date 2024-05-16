import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDatabase() {
    //*in a 1 - n relation, delete N firstly, then delete "1"
    return this.$transaction([
      //* 2 commands in One transaction
      this.note.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
