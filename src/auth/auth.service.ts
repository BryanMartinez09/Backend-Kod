import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private users: UserService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const u = await this.users.findByEmail(email);
    if (!u || !u.isActive) return null;
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return null;
    return { id: u.id, email: u.email, name: u.name };
  }

  sign(user: { id: number; email: string; name: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, name: user.name });
  }
}
