import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AllowUnauthorizedRequest } from 'src/decorators/unauthorized.decorator';
import { AdminService } from './admin.service';
import * as dtos from './dto';
import { AdminLocalAuthGuard } from './guards/local-auth-guard';
import { AdminJwtAuthGuard } from './guards/jwt-auth-guard';

@Controller('/admin')
@UseGuards(AdminJwtAuthGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('/auth/login')
  @AllowUnauthorizedRequest()
  @UseGuards(AdminLocalAuthGuard)
  login(@Body() _body: dtos.AdminLoginDTO, @Req() req: any) {
    return this.service.login(req.user);
  }
}
