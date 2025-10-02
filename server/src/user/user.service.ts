import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto, LoginUserDto } from "./user.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userSchema: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    async createUser(createDto: CreateUserDto): Promise<any> {
        const existingUser = await this.userSchema.findOne({ email: createDto.email });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        if (createDto.password !== createDto.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        let hashPass = await bcrypt.hash(createDto.password, 10);
        createDto.password = hashPass;
        createDto.confirmPassword = hashPass;
        const newUser = await this.userSchema.create(createDto);
        return {
            message: 'User created successfully',
            data: newUser
        }

    }

    async loginUser(loginDto: LoginUserDto): Promise<any> {
        let userExist = await this.userSchema.findOne({ email: loginDto.email });
        if (!userExist) {
            throw new Error('User with this email does not exist');
        }
        let isMatch = await bcrypt.compare(loginDto.password, userExist.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = await this.jwtService.sign({
            id: userExist._id, email: userExist.email
        });

        return {
            message: 'Login successful',
            data: userExist,
            token
        }
    }

    async getUserProfile(userId: string): Promise<any> {
        const user = await this.userSchema.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        console.log(user);
        return {
            message: 'User profile retrieved successfully',
            data: user
        }
    }

}