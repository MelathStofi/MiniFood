import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  create(user: Partial<User>): Promise<User> {
    const newUser: User = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
