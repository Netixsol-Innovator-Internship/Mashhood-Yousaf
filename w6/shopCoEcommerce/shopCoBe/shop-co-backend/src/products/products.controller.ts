// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorater';
import { UserRole } from '../users/schemas/user.schema';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category: string,
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number,
    @Query('search') search: string,
    @Query('dressStyle') dressStyle: string, // Add dressStyle here
    @Res() res,
  ) {
    try {
      const result = await this.productsService.findAll(
        page,
        limit,
        category,
        minPrice,
        maxPrice,
        search,
        dressStyle,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res) {
    try {
      const product = await this.productsService.findById(id);
      return res.status(HttpStatus.OK).json(product);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async create(@Body() createProductDto: any, @Res() res) {
    try {
      // Validate size and dressStyle fields
      const validSizes = ['small', 'medium', 'large', 'xl'];
      const validDressStyles = ['casual', 'formal', 'gym', 'party'];

      if (!validSizes.includes(createProductDto.size)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid size.' });
      }

      if (!validDressStyles.includes(createProductDto.dressStyle)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Invalid dress style.' });
      }

      const product = await this.productsService.create(createProductDto);
      return res.status(HttpStatus.CREATED).json(product);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: any,
    @Res() res,
  ) {
    try {
      const product = await this.productsService.update(id, updateProductDto);
      return res.status(HttpStatus.OK).json(product);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  async remove(@Param('id') id: string, @Res() res) {
    try {
      await this.productsService.remove(id);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Product deleted successfully' });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }
}
