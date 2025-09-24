// src/auth/auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(email: string, password: string) {
    if (!email.trim() || !password.trim()) {
      throw new BadRequestException('required fields is empty');
    }
    
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashed });
    await user.save();

    return { message: 'User registered successfully' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email };
    const token = this.jwtService.sign(payload);
    return { token, user };
  }

  async validateUser(payload: any) {
    return await this.userModel.findOne({ email: payload.email });
  }
}
