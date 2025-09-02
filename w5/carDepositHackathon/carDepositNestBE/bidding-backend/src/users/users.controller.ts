import { Controller, Get, Put, UseGuards, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.findPublicById(req.user.userId);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(@Req() req: any, @Body() body: UpdateUserDto) {
    return this.usersService.update(req.user.userId, body);
  }
}
