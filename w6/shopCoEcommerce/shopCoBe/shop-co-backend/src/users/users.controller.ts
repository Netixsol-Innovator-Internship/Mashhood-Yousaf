// src/users/users.controller.ts
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorater';
import { UserRole } from './schemas/user.schema';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async findAll(@Res() res) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get('profile')
  async getProfile(@Request() req, @Res() res) {
    try {
      const user = await this.usersService.findById(req.user.userId);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: any, @Res() res) {
    try {
      const user = await this.usersService.update(
        req.user.userId,
        updateUserDto,
      );
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put('change-password')
  async changePassword(@Request() req, @Body() passwordData: any, @Res() res) {
    try {
      // Implementation for password change
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Password changed successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put('address')
  async addAddress(@Request() req, @Body() address: any, @Res() res) {
    try {
      const user = await this.usersService.addAddress(req.user.userId, address);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put('address/:addressId')
  async updateAddress(
    @Request() req,
    @Param('addressId') addressId: string,
    @Body() address: any,
    @Res() res,
  ) {
    try {
      const user = await this.usersService.updateAddress(
        req.user.userId,
        addressId,
        address,
      );
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Delete('address/:addressId')
  async removeAddress(
    @Request() req,
    @Param('addressId') addressId: string,
    @Res() res,
  ) {
    try {
      const user = await this.usersService.removeAddress(
        req.user.userId,
        addressId,
      );
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put('wishlist/:productId')
  async addToWishlist(
    @Request() req,
    @Param('productId') productId: string,
    @Res() res,
  ) {
    try {
      const user = await this.usersService.addToWishlist(
        req.user.userId,
        productId,
      );
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Delete('wishlist/:productId')
  async removeFromWishlist(
    @Request() req,
    @Param('productId') productId: string,
    @Res() res,
  ) {
    try {
      const user = await this.usersService.removeFromWishlist(
        req.user.userId,
        productId,
      );
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put(':id/role')
  @Roles(UserRole.SUPERADMIN)
  async updateRole(@Param('id') id: string, @Body() roleData: any, @Res() res) {
    try {
      const user = await this.usersService.update(id, { role: roleData.role });
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async updateStatus(
    @Param('id') id: string,
    @Body() statusData: any,
    @Res() res,
  ) {
    try {
      const user = await this.usersService.update(id, {
        isActive: statusData.isActive,
      });
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
