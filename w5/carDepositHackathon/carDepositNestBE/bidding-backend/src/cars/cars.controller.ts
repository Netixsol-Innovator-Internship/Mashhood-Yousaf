import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCarDto } from './dto/create-car.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateCarDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.carsService.create(dto, req.user.userId, file);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.carsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.carsService.update(id, req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.carsService.remove(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyCars(@Req() req: any) {
    console.log('Logged-in userId:', req.user.userId);
    return this.carsService.findByOwner(req.user.userId);
  }
}
 