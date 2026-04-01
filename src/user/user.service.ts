import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { deleted: false } });
  }

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username, deleted: false });
  }

  create(user: Partial<User>): Promise<User> {
    const newUser: User = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user: User | null = await this.userRepository.findOneBy({ id });

    if (!user) {
      return;
    }

    user.deleted = true;
    await this.userRepository.save(user);
  }
}
