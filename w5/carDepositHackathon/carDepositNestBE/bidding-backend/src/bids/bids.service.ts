import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { Model } from 'mongoose';
import { AuctionsService } from '../auctions/auctions.service';
import { CarsService } from '../cars/cars.service';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    private auctionsService: AuctionsService,
    private carsService: CarsService,
    private usersService: UsersService,
  ) {}

  async placeBid(userId: string, auctionId: string, amount: number) {
    // verify auction & car
    const auction: any = await this.auctionsService.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');

    if (auction.status !== 'live')
      throw new BadRequestException('Auction not live');

    // load car
    // const car: any = await this.carsService.findById(auction.car.toString());
    const car: any = auction.car;
    console.log('auction.car =', auction.car, typeof auction.car);
    if (!car) throw new NotFoundException('Car not found');

    if (car.owner.toString() === userId)
      throw new BadRequestException('Cannot bid on your own car');

    if (amount <= auction.currentBid)
      throw new BadRequestException('Bid must be higher than current bid');

    // create bid
    // const bid = new this.bidModel({
    //   user: userId,
    //   auction: auctionId,
    //   car: car._id,
    //   amount,
    // });

    // why commented the upper  bid Object, because this was  storing referneces as a string not as an object , so the populate etc method can't work
    const bid = new this.bidModel({
      user: new Types.ObjectId(userId),
      auction: new Types.ObjectId(auctionId),
      car: car._id,
      amount,
    });
    const saved = await bid.save();

    // update user/myBids
    // await this.usersService.addBid(userId, saved._id.toString());
    await this.usersService.addBid(
      userId,
      (saved._id as Types.ObjectId).toString(),
    );

    // update auction
    await this.auctionsService.updateBid(
      auctionId,
      amount,
      userId,
      (saved._id as Types.ObjectId).toString(),
    );

    return saved;
  }

  // .find({ auction: auctionId })
  async findByAuction(auctionId: string) {
    return this.bidModel
      .find({ auction: new Types.ObjectId(auctionId) })
      .sort({ amount: -1, createdAt: -1 })
      .populate('user', '-password')
      .exec();
  }
}
