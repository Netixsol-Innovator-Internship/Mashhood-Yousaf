// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.createSuperAdmin();
  }

  async create(createUserDto: any): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: any): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async addAddress(userId: string, address: any): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { addresses: address } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    address: any,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndUpdate(
        { _id: userId, 'addresses._id': addressId },
        { $set: { 'addresses.$': address } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User or address not found');
    }

    return user;
  }

  async removeAddress(
    userId: string,
    addressId: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { addresses: { _id: addressId } } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateLoyaltyPoints(
    userId: string,
    points: number,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $inc: { loyaltyPoints: points } },
        { new: true },
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async createSuperAdmin() {
    const superAdminEmail = 'superAdmin@admin.com';
    const existingSuperAdmin = await this.userModel
      .findOne({
        email: superAdminEmail,
        role: UserRole.SUPERADMIN,
      })
      .exec();

    if (!existingSuperAdmin) {
      const superAdmin = new this.userModel({
        name: 'Super Admin',
        email: superAdminEmail,
        password:
          '$2b$10$r8V.7JkZq1W2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', // hashed password
        phone: '0000000000',
        role: UserRole.SUPERADMIN,
        loyaltyPoints: 0,
        addresses: [],
        wishlist: [],
        isActive: true,
      });
      await superAdmin.save();
      console.log('Super Admin created successfully');
    }
  }
}
