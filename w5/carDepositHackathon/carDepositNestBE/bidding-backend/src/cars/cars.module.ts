import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { UsersModule } from '../users/users.module';
import { CloudinaryService } from '../cloudinary.service'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    UsersModule,
  ],
  providers: [CarsService, CloudinaryService],
  controllers: [CarsController],
  exports: [CarsService],
})
export class CarsModule {}
