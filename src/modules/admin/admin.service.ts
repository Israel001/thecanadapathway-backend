import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAdminAuthContext } from 'src/types';
import { AdminUser } from './admin.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Student } from 'src/entities/students.entity';
import { AdminUserDto } from './dto';
import { nanoid } from 'nanoid';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly sharedService: SharedService,
  ) {}

  async findUserByEmail(email: string) {
    return this.adminUserRepository.findOne({
      where: { email },
    });
  }

  async giveAccessCode(email: string, name: string) {
    const studentModel = this.studentRepository.create({
      fullName: name,
      email: email,
      accessCode: nanoid().toUpperCase(),
      suspended: false,
    });
    const studentExists = await this.studentRepository.findOne({
      where: { email },
    });
    if (studentExists) studentModel.id = studentExists.id;
    await this.studentRepository.save(studentModel);

    // send access code to student email
    await this.sharedService.sendEmail({
      templateCode: 'order_received',
      to: studentModel.email,
      subject: 'Welcome to the Academy',
      data: {
        fullName: studentModel.fullName,
        email: studentModel.email,
        accessCode: studentModel.accessCode,
      },
    });

    return {
      success: true,
      message: 'Access code sent successfully',
    };
  }

  async getActiveStudents() {
    return this.studentRepository.find({
      where: {
        suspended: false,
      },
    });
  }

  async getSuspendedStudents() {
    return this.studentRepository.find({
      where: {
        suspended: true,
      },
    });
  }

  async suspendUser(userId: number) {
    const user = await this.studentRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User does not exist');
    const userModel = this.studentRepository.create({
      id: user.id,
      suspended: true,
    });
    return this.studentRepository.save(userModel);
  }

  async activateUser(userId: number) {
    const user = await this.studentRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User does not exist');
    const userModel = this.studentRepository.create({
      id: user.id,
      suspended: false,
    });
    return this.studentRepository.save(userModel);
  }

  async createUser(user: AdminUserDto) {
    const userExists = await this.adminUserRepository.findOne({
      where: { email: user.email },
    });
    if (userExists)
      throw new ConflictException(
        `User with email: ${user.email} already exists`,
      );
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const adminUserModel = this.adminUserRepository.create({
      fullName: user.fullName,
      email: user.email,
      password: hashedPassword,
    });
    await this.adminUserRepository.save(adminUserModel);
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) return user;
    throw new UnauthorizedException('Invalid details');
  }

  async login(user: AdminUser) {
    const payload: IAdminAuthContext = {
      userId: user.id,
      name: user.fullName,
      email: user.email,
    };
    const userInfo = await this.findUserByEmail(user.email);
    delete userInfo.password;
    delete userInfo.createdAt;
    delete userInfo.updatedAt;
    return {
      accessToken: this.jwtService.sign(payload),
      user: userInfo,
    };
  }
}
