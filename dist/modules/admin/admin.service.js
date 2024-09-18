"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const admin_entities_1 = require("./admin.entities");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const students_entity_1 = require("../../entities/students.entity");
const nanoid_1 = require("nanoid");
const shared_service_1 = require("../shared/shared.service");
let AdminService = class AdminService {
    constructor(jwtService, adminUserRepository, studentRepository, sharedService) {
        this.jwtService = jwtService;
        this.adminUserRepository = adminUserRepository;
        this.studentRepository = studentRepository;
        this.sharedService = sharedService;
    }
    async findUserByEmail(email) {
        return this.adminUserRepository.findOne({
            where: { email },
        });
    }
    async giveAccessCode(email, name) {
        const studentModel = this.studentRepository.create({
            fullName: name,
            email: email,
            accessCode: (0, nanoid_1.nanoid)().toUpperCase(),
            suspended: false,
        });
        const studentExists = await this.studentRepository.findOne({
            where: { email },
        });
        if (studentExists)
            studentModel.id = studentExists.id;
        await this.studentRepository.save(studentModel);
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
    async suspendUser(userId) {
        const user = await this.studentRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User does not exist');
        const userModel = this.studentRepository.create({
            id: user.id,
            suspended: true,
        });
        return this.studentRepository.save(userModel);
    }
    async activateUser(userId) {
        const user = await this.studentRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User does not exist');
        const userModel = this.studentRepository.create({
            id: user.id,
            suspended: false,
        });
        return this.studentRepository.save(userModel);
    }
    async createUser(user) {
        const userExists = await this.adminUserRepository.findOne({
            where: { email: user.email },
        });
        if (userExists)
            throw new common_1.ConflictException(`User with email: ${user.email} already exists`);
        const hashedPassword = await bcryptjs_1.default.hash(user.password, 12);
        const adminUserModel = this.adminUserRepository.create({
            fullName: user.fullName,
            email: user.email,
            password: hashedPassword,
        });
        await this.adminUserRepository.save(adminUserModel);
    }
    async validateUser(email, password) {
        const user = await this.findUserByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (passwordMatch)
            return user;
        throw new common_1.UnauthorizedException('Invalid details');
    }
    async login(user) {
        const payload = {
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
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(admin_entities_1.AdminUser)),
    __param(2, (0, typeorm_1.InjectRepository)(students_entity_1.Student)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        shared_service_1.SharedService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map