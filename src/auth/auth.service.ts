import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import prisma from '../prismaClient';
// از این پس از bcryptjs استفاده می‌کنیم
import * as bcrypt from 'bcryptjs'; // <--- اصلاح اصلی
import { Role } from '@prisma/client';
import { RegisterUserDto } from './register-user.dto';
import { LoginUserDto } from './login-user.dto';


@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(userData: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || Role.USER,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginUserDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');

    const payload = { sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
