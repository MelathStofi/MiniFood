import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from './jwt.guard';
import { JwtPayload } from './jwt.model';
import { LoginResponse, LogoutResponse, RegisterResponse } from './auth.model';

type JwtRequest = Request & {
  user: JwtPayload;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: Partial<User>): Promise<RegisterResponse> {
    return this.authService.register(user);
  }

  @Post('login')
  login(
    @Body() user: Pick<User, 'username' | 'password'>,
  ): Promise<LoginResponse> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: JwtRequest): Promise<LogoutResponse> {
    return this.authService.logout(req.user.userId);
  }
}
