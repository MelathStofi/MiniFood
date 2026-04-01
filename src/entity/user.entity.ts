import { Entity, Column } from 'typeorm';
import { BaseModelEntity } from './base-model.entity';

@Entity()
export class User extends BaseModelEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: 0 })
  tokenVersion: number;
}
