import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    public prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: { userId: number; email: string }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    delete user.hashedPassword;
    return user;
  }
}
