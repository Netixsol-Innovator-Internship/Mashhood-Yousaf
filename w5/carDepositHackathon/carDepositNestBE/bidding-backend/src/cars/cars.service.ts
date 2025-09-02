import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { UsersService } from '../users/users.service';
import { CloudinaryService } from 'src/cloudinary.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createDto: any, ownerId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const imageUrl = await this.cloudinaryService.uploadImage(file);

    const car = new this.carModel({
      ...createDto,
      owner: ownerId,
      image: imageUrl,
    });
    const saved = await car.save();
    // await this.usersService.addCar(ownerId, saved._id.toString());
    await this.usersService.addCar(
      ownerId,
      (saved._id as Types.ObjectId).toString(),
    );
    return saved;
  }

  // basic filters: make, model, year, priceMin, priceMax, category
  async findAll(query: any) {
    const q: any = {};
    if (query.make) q.make = query.make;
    if (query.model) q.model = query.model;
    if (query.year) q.year = Number(query.year);
    if (query.category) q.category = query.category;
    if (query.priceMin || query.priceMax) {
      q.price = {};
      if (query.priceMin) q.price.$gte = Number(query.priceMin);
      if (query.priceMax) q.price.$lte = Number(query.priceMax);
    }
    return this.carModel.find(q).exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Car not found');
    const car = await this.carModel.findById(id).exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async update(id: string, ownerId: string, payload: any) {
    const car = await this.findById(id);
    if (car.owner.toString() !== ownerId)
      throw new ForbiddenException('Only owner can update');
    return this.carModel.findByIdAndUpdate(id, payload, { new: true }).exec();
  }

  async remove(id: string, ownerId: string) {
    const car = await this.findById(id);
    if (car.owner.toString() !== ownerId)
      throw new ForbiddenException('Only owner can delete');
    return this.carModel.findByIdAndDelete(id).exec();
  }

  async findByOwner(ownerId: string) {
    return this.carModel.find({ owner: ownerId }).exec();
  }
}
