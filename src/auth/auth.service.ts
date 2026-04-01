import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entity/user.entity';
import { UserService } from '../user/user.service';

type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
};

type RegisterResponse = {
  message: string;
  user: User;
};

type LogoutResponse = {
  message: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async register(user: Partial<User>): Promise<RegisterResponse> {
    const existingUser: User | null = await this.usersService.findOneByUsername(
      user.username!,
    );

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword: string = await bcrypt.hash(user.password!, 10);

    const createdUser: User = await this.usersService.create({
      ...user,
      password: hashedPassword,
      tokenVersion: 0,
    });

    return {
      message: 'Registration successful',
      user: createdUser,
    };
  }

  async login(
    user: Pick<User, 'username' | 'password'>,
  ): Promise<LoginResponse> {
    const foundUser: User | null = await this.usersService.findOneByUsername(
      user.username,
    );

    if (!foundUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      user.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload: {
      sub: number;
      username: string;
      email?: string;
      tokenVersion: number;
    } = {
      sub: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      tokenVersion: foundUser.tokenVersion,
    };

    const accessToken: string = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
      },
    };
  }

  async logout(userId: number): Promise<LogoutResponse> {
    const foundUser: User | null = await this.usersService.findOneById(userId);

    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }

    foundUser.tokenVersion += 1;
    await this.usersService.save(foundUser);

    return {
      message: 'Logout successful',
    };
  }
}
