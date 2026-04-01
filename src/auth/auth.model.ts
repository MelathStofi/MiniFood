import { User } from '../entity/user.entity';

export type RegisterResponse = {
  message: string;
  user: User;
};

export type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
};

export type LogoutResponse = {
  message: string;
};
