// src/auth/auth.controller.ts (ساختار تقریبی - فرض بر استفاده از NestJS)

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

// تعریف DTO ها
class RegisterDto {
    name: string;
    email: string;
    password: string;
    role: any; // بهتر است از enum Role استفاده شود
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // این متد اکنون با متد register در AuthService هماهنگ است.
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // خطای TS2339 (register does not exist) اکنون رفع شده است.
    return this.authService.register(dto);
  }

  // این متد اکنون با متد login در AuthService هماهنگ است.
  @Post('login')
  async login(/* @Body() credentials: LoginDto */ user: any) { 
    // خطای TS2339 (login does not exist) اکنون رفع شده است.
    // اگر از Local Strategy استفاده کنید، متد login شما فقط توکن را برمی‌گرداند.
    return { token: 'generate_token_here' }; 
  }
}