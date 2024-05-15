import { ForbiddenException, Injectable } from '@nestjs/common';
// import { User, Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable({}) //*This is "Dependency Injection"
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(authDTO: AuthDTO) {
    const hashedPassword = await argon.hash(authDTO.password);
    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDTO.email,
          hashedPassword: hashedPassword,
          firstName: '',
          lastName: '',
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
      return {
        message: 'Register an user',
        data: user,
      };
    } catch (err) {
      if (err.code == 'P2002') {
        // throw new ForbiddenException(err.message);
        //*for simple
        throw new ForbiddenException('Error in credentials');
      }
    }
  }
  async login(authDTO: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDTO.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordMatched = await argon.verify(
      user.hashedPassword,
      authDTO.password,
    );

    if (!passwordMatched) {
      throw new ForbiddenException('Email or password incorrect');
    }
    delete user.hashedPassword;
    return {
      message: 'Login successfully',
      data: await this.signJwtToken(user.id, user.email),
    };
  }
  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{
    accessToken: string;
  }> {
    const payload = {
      userId,
      email,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken,
    };
  }
}
