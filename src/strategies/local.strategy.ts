import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AppService } from 'src/app.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly service: AppService) {
    super({ usernameField: 'accessCode' });
  }

  async validate(accessCode: string) {
    console.log('here???');
    // const user = await this.service.validateUser(accessCode);
    return {};
  }
}
