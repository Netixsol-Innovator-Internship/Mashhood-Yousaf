/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(username: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({ username, email, password: hashed });
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.userModel.findById(id).exec();
  }

  async findPublicById(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async update(id: string, payload: any) {
    const user = await this.userModel
      .findByIdAndUpdate(id, payload, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // .findByIdAndUpdate(userId, { $push: { myCars: carId } }, { new: true })
  // async addCar(userId: string, carId: string) {
  //   return this.userModel
  //     .findByIdAndUpdate(
  //       userId,
  //       { $push: { myCars: new Types.ObjectId(carId) } },
  //       { new: true },
  //     )
  //     .exec();
  // }

  async addCar(userId: string, carId: string) {
    return this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $push: { myCars: new Types.ObjectId(carId) } },
        { new: true },
      )
      .exec();
  }

  // .findByIdAndUpdate(userId, { $push: { myBids: bidId } }, { new: true })
  async addBid(userId: string, bidId: string) {
    return this.userModel
      .findByIdAndUpdate(
          new Types.ObjectId(userId),
        { $push: { myBids: new Types.ObjectId(bidId) } },
        { new: true },
      )
      .exec();
  }

  // { $push: { winningBids: bidId } },
  async addWinningBid(userId: string, bidId: string) {
    return this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $push: { winningBids: new Types.ObjectId(bidId) } },
        { new: true },
      )
      .exec();
  }

  async addToWishlist(userId: string, carId: string) {
    return this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $addToSet: { wishlist: carId } },
        { new: true },
      )
      .exec();
  }

  async removeFromWishlist(userId: string, carId: string) {
    return this.userModel
      .findByIdAndUpdate(userId, { $pull: { wishlist: carId } }, { new: true })
      .exec();
  }

  // async addToMyBids(userId: string, bidId: Types.ObjectId): Promise<User> {
  //   return this.userModel
  //     .findByIdAndUpdate(
  //       userId,
  //       { $addToSet: { myBids: bidId } },
  //       { new: true },
  //     )
  //     .exec();
  // }
  // async addToMyBids(userId: string, bidId: Types.ObjectId): Promise<User> {
  //   return this.userModel
  //     .findByIdAndUpdate(
  //       userId,
  //       { $addToSet: { myBids: bidId } },
  //       { new: true },
  //     )
  //     .exec();
  // }
}
