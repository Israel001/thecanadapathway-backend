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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const util_1 = __importDefault(require("util"));
const jwt_1 = require("@nestjs/jwt");
const students_entity_1 = require("./entities/students.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payments_entity_1 = require("./entities/payments.entity");
const shared_service_1 = require("./modules/shared/shared.service");
const otp_generator_1 = __importDefault(require("otp-generator"));
const moment_1 = __importDefault(require("moment"));
let AppService = class AppService {
    constructor(configService, jwtService, sharedService, studentRepository, paymentRepository) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.sharedService = sharedService;
        this.studentRepository = studentRepository;
        this.paymentRepository = paymentRepository;
        this.flutterwaveConfig =
            this.configService.get('flutterwaveConfig');
    }
    async login(accessCode) {
        const user = await this.studentRepository.findOne({
            where: { accessCode },
        });
        if (!user)
            throw new common_1.NotFoundException('Access code not found');
        if (user.suspended)
            throw new common_1.NotAcceptableException('User is suspended');
        delete user.createdAt;
        delete user.updatedAt;
        delete user.accessCode;
        return {
            accessToken: this.jwtService.sign({
                email: user.email,
                name: user.fullName,
            }),
            user,
        };
    }
    async verifyTransaction(transactionId, { email, amount }) {
        const response = await axios_1.default
            .get(`${this.flutterwaveConfig.baseUrl}/transactions/${transactionId}/verify`, {
            headers: {
                Authorization: `Bearer ${this.flutterwaveConfig.secretKey}`,
            },
        })
            .catch((error) => {
            console.log(util_1.default.inspect(error.response, true, null, false));
            throw new Error(util_1.default.inspect(error.response, true, null, false));
        });
        const data = response.data.data;
        if (data.status !== 'successful' ||
            data.amount !== amount ||
            data.customer.email !== email) {
            throw new common_1.NotAcceptableException('Transaction is not valid');
        }
        const accessCode = data.tx_ref.toUpperCase();
        const paymentExists = await this.paymentRepository.findOne({
            where: { reference: accessCode },
        });
        if (paymentExists)
            throw new common_1.ConflictException('Duplicate payment');
        const paymentModel = this.paymentRepository.create({
            transactionId: data.id,
            reference: accessCode,
            email: data.customer.email,
            metadata: JSON.stringify(data),
        });
        await this.paymentRepository.save(paymentModel);
        const studentModel = this.studentRepository.create({
            fullName: data.customer.name,
            email: data.customer.email,
            accessCode,
            suspended: false,
        });
        const studentExists = await this.studentRepository.findOne({
            where: { email: data.customer.email },
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
            message: 'Transaction verified successfully',
        };
    }
    async sendPreOrderEmail(details) {
        await this.sharedService.sendEmail({
            templateCode: 'pre_order',
            to: details.email,
            subject: 'Complete Your Canada Ultimate Guide Order',
            data: {
                fullName: details.fullName,
                orderNumber: otp_generator_1.default.generate(8, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                }),
                date: (0, moment_1.default)().add(1, 'hours').format('LL'),
                itemPrice: details.itemPrice,
                offerPrice: details.offerPrice,
                totalPrice: details.totalPrice,
                url: `https://thecanadapathway.com/take-action-now?currency=${details.currency}&email=${details.email}&name=${details.fullName}&page=${details.page}&expiryDate=${details.expiryDate}`,
            },
        });
        return true;
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(students_entity_1.Student)),
    __param(4, (0, typeorm_1.InjectRepository)(payments_entity_1.Payment)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        shared_service_1.SharedService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map