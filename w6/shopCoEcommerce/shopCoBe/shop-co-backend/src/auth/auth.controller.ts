// src/auth/auth.controller.ts
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res) {
    try {
      const result = await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    try {
      const result = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message,
      });
    }
  }

  // OTP
  // @Post('verify-otp')
  // async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Res() res) {
  //   try {
  //     const result = await this.authService.verifyOtp(verifyOtpDto);
  //     return res.status(HttpStatus.OK).json(result);
  //   } catch (error) {
  //     return res.status(HttpStatus.BAD_REQUEST).json({
  //       message: error.message,
  //     });
  //   }
  // }
  // OTP

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string, @Res() res) {
    try {
      const result = await this.authService.refreshToken(refreshToken);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: error.message,
      });
    }
  }
}
