// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
   
      secretOrKey: config.get<string>('JWT_SECRET', 'dev_fallback_change_me'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
