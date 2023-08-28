import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AppService } from 'src/app.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly service: AppService) {
    super({ usernameField: 'accessCode', passReqToCallback: true });
  }

  async validate(accessCode: string) {
    const user = await this.service.validateUser(accessCode);
    return user;
  }
}
