import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async register(username: string, email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);
    if (exists) throw new BadRequestException('Email already registered');
    const user = await this.usersService.create(username, email, password);
    return { id: user._id, username: user.username, email: user.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return null;
    return user;
  }

  async login(email: string, password: string) {
    // 1. Fetch the user and populate related fields
    const user = await this.userModel
      .findOne({ email })
      .select('+password') // if password is select: false
      .populate({
        path: 'myBids',
        populate: {
          path: 'car', // Bid ke andar jo car hai
          model: 'Car',
          populate: {
            path: 'owner', // Car ke andar jo owner hai
            model: 'User',
          },
        },
      })
      .populate({
        path: 'myCars',
        populate: [
          { path: 'owner', model: 'User' },
          { path: 'auctionId', model: 'Auction' },
        ],
      })
      .populate({
        path: 'wishlist',
        populate: {
          path: 'car',
          model: 'Car',
          populate: { path: 'owner', model: 'User' },
        },
      })
      .populate({
        path: 'winningBids',
        populate: {
          path: 'car',
          model: 'Car',
        },
      });
    // .populate('myBids')
    // .populate('myCars')
    // .populate('wishlist')
    // .populate('winningBids');

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Build token payload (keep it lightweight)
    const payload = {
      username: user.username,
      userId: user._id,
      email: user.email,
    };

    // 4. Return token + full user data (populated)
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        myBids: user.myBids,
        myCars: user.myCars,
        wishlist: user.wishlist,
        winningBids: user.winningBids,
      },
    };
  }

  // async login(email: string, password: string) {
  //   const user = await this.validateUser(email, password);
  //   if (!user) throw new UnauthorizedException('Invalid credentials');
  //   const payload = {
  //     username: user.username,
  //     userId: user._id,
  //     email: user.email,
  //   };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     user: { id: user._id, username: user.username, email: user.email },
  //   };
  // }
}
