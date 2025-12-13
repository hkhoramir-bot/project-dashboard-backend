// src/auth/jwt.strategy.ts (فایل اصلاح شده)

import prisma from '../prismaClient'; // مطمئن شوید مسیر صحیح است
import { Strategy, ExtractJwt } from 'passport-jwt'; // ExtractJwt را اضافه کنید
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // اگر از ConfigService استفاده می‌کنید، آن را Inject کنید.
  constructor(/* private configService: ConfigService */) {
    super({
      // ۱. توکن را از هدر Authorization استخراج کن.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // ۲. انقضای توکن را نادیده نگیر (معمولاً false).
      ignoreExpiration: false,
      
      // ۳. کلید سری: کلید مشترک بین JwtStrategy و JwtService
      // ⚠️ این کلید را حتماً از طریق ConfigService یا متغیر محیطی بخوانید.
      // secretOrKey: configService.get('JWT_SECRET'),
      secretOrKey: 'YOUR_SECRET_KEY', // 👈 این خط باید اصلاح شود.
    });
  }

  async validate(payload: any) {
    // 'sub' استاندارد برای Subject است که معمولاً همان user ID است.
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    
    // PassportJS شیء برگردانده شده را به req.user اضافه می‌کند.
    return user;
  }
}