import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //*some requests from client
  @Post('register') //*register a new user
  @HttpCode(200)
  register(@Body() body: AuthDTO) {
    //*body's type must be a "Data Transfer Object" DTO
    //*now controller canlls "service"

    // console.log(body);
    return this.authService.register(body);
  }

  @Post('login') //*register a new user
  @HttpCode(201)
  login(@Body() body: AuthDTO) {
    return this.authService.login(body);
  }
}
