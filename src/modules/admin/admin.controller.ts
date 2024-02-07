import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Post('/user')
  createUser(@Body() body: dtos.AdminUserDto) {
    return this.service.createUser(body);
  }

  @Post('/give-access-code')
  giveAccessCode(@Body() body: { email: string; name: string }) {
    return this.service.giveAccessCode(body.email, body.name);
  }

  @Get('/active-students')
  getActiveStudents() {
    return this.service.getActiveStudents();
  }

  @Get('/suspended-students')
  getSuspendedStudents() {
    return this.service.getSuspendedStudents();
  }

  @Post('/:userId/suspend')
  suspendUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.suspendUser(userId);
  }

  @Post('/:userId/activate')
  activateUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.activateUser(userId);
  }
}
