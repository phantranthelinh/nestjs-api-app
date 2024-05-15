import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @Get('me')
  @UseGuards(MyJwtGuard)
  me(@Req() request: Request) {
    return request.user;
  }
}
