import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SECRET_KEY_خیلی_امن', // بعداً از ENV بخوان
    });
  }

  async validate(payload: any) {
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;
    return user;
  }
}
