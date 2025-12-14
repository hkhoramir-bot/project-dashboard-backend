import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './register-user.dto';
import { LoginUserDto } from './login-user.dto';

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
