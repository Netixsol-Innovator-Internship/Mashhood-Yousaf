// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
