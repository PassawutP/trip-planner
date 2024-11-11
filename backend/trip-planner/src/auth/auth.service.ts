
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const userInfo = await this.usersService.findOne(email);
    if (!userInfo || !userInfo.user) {
        throw new UnauthorizedException('User not found');
    }

    if (userInfo.user?.password !== pass) {
      throw new UnauthorizedException('Incorrect password');
    }
    const payload = { email: userInfo.user.email, username: userInfo.user.username, sub: userInfo.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
