import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import prisma from '../prismaClient';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

// DTO پیشنهادی
interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  role?: Role; // اختیاری، اگر مشخص نشود پیش‌فرض USER در Prisma اعمال می‌شود
}

interface LoginUserDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // ثبت‌نام کاربر
  async register(userData: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || Role.USER, // اگر مقدار role نبود، USER پیش‌فرض شود
      },
    });

    // بازگشت اطلاعات ضروری بدون password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  // ورود کاربر و ایجاد JWT
  async login(dto: LoginUserDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('ایمیل یا رمز عبور اشتباه است');
    }

    // payload شامل id و role
    const payload = { sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // بازگشت توکن و اطلاعات کاربر
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
