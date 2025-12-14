import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dto'; // فرض می‌کنیم DTO ها در یک فایل dto/index.ts جمع شده‌اند

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ثبت‌نام
  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  // ورود
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto); // ✅ فقط یک آرگومان
  }
}
