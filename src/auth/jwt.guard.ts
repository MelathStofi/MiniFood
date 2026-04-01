import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.model';
import { User } from '../entity/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly usersService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivateJwt: boolean = (await super.canActivate(
      context,
    )) as boolean;

    if (!canActivateJwt) {
      return false;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const payload: JwtPayload = request.user;

    const user: User | null = await this.usersService.findOneById(
      payload.userId,
    );

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}
