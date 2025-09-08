// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// import { sendOTPEmail } from 'src/utils/mail.service';
// import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // For  OTP
    // Generate 6-digit OTP
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // For  OTP

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      // OTP
      // otp,
      // otpExpiresAt,
      // emailVerified: false,
      // OTP
    });

    // Send OTP Email
    // await sendOTPEmail(user.email, otp);
    // return {
    //   message: 'Registered successfully. Please verify OTP sent to your email.',
    // };

    const tokens = await this.generateTokens(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  // OTP
  // async verifyOtp({ email, otp }: VerifyOtpDto) {
  //   const user = await this.usersService.findByEmail(email);
  //   if (!user) throw new UnauthorizedException('User not found');

  //   if (user.emailVerified)
  //     throw new UnauthorizedException('Email already verified');

  //   if (user.emailVerificationOtp !== otp)
  //     throw new UnauthorizedException('Invalid OTP');

  //   if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
  //     throw new UnauthorizedException('OTP has expired');
  //   }

  //   user.emailVerified = true;
  //   user.emailVerificationOtp = null;
  //   user.otpExpiresAt = undefined; // or use `delete user.otpExpiresAt`
  //   await user.save();

  //   return { message: 'Email verified successfully' };
  // }
  // OTP

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // if (!user.emailVerified) {
    //   throw new UnauthorizedException(
    //     'Please verify your email before logging in',
    //   );
    // }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: 'ShopCoProject',
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }
}
