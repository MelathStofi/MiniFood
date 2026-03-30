import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: User) {
    return new Promise((resolve, reject) => {
      const payload = {
        name: user.username,
        email: user.email,
        password: user.password,
      };
      try {
        const accessToken: string = this.jwtService.sign(payload);
        resolve({ access_token: accessToken });
      } catch (error) {
        reject(new Error('Failed to generate token'));
      }
    });
  }
}
