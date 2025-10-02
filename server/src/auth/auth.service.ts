import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Model } from 'mongoose';


@Injectable()
export class AuthService {
    private otpStore = {};
    private otpExpiryTime = 600000;
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private userSchema: Model<UserDocument>
    ) { }

    async register(): Promise<any> {
        return true;
    }
    /**
     *
     * @param password
     * @param passwordHash
     * @returns
     */
    compareUserPassword(password: any, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }
    /**
     * @param password
     * @returns
     */
    generateUserPassword(password: any): any {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }
    /**
     * @param payload
     * @returns
     */
    generateJWTToken(payload: any, secret: string = process.env.JWT_SECRET): any {
        if (secret) {
            return `Bearer ${this.jwtService.sign(payload, { secret })}`;
        }
        return `Bearer ${this.jwtService.sign(payload)}`;
    }
    /**
     * @param authToken string
     * @returns
     */
    decodeAuthToken(authToken: string): any {
        const authTokenArray = authToken.split(' ');
        if (authTokenArray.length > 1) {
            const tokenPayload = this.jwtService.decode(authTokenArray[1]);
            return { token: authTokenArray[1], tokenPayload, fullToken: authToken };
        }
        const tokenPayload = this.jwtService.decode(authToken);
        return { token: authToken, tokenPayload, fullToken: authToken };
    }
    /**
     * @param authToken string
     * @returns
     */
    verifyAuthToken(authToken: string, secret: string = null): any {
        secret = process.env.JWT_SECRET;
        const authTokenArray = authToken.split(' ');
        if (authTokenArray.length > 1) {
            if (secret) {
                return this.jwtService.verify(authTokenArray[1], { secret });
            }
            return this.jwtService.verify(authTokenArray[1]);
        }
        if (secret) {
            return this.jwtService.verify(authToken, { secret });
        }
        return this.jwtService.verify(authToken);
    }

    generateUniqueId(): string {
        return crypto.randomBytes(16).toString('hex');
    }

    async verifyOtp(email: string, otp: string): Promise<any> {
        const otpRecord = this.otpStore[email];
        if (!otpRecord || otpRecord.expiry < Date.now()) {
            return 'OTP expired or invalid';
        }
        if (otpRecord.otp !== otp) {
            return 'Invalid OTP';
        }
        return true;
    }
    async deleteOtp(email: string) {
        delete this.otpStore[email];
    }

}