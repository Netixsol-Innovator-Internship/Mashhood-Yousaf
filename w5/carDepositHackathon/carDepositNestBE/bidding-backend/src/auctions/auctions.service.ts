import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';
import { Model, Types } from 'mongoose';
import { CarsService } from '../cars/cars.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
    private carsService: CarsService,
    private websocket: WebsocketGateway,
  ) {}

  // async createForCar(carId: string, startDate: Date, endDate: Date) {
  //   // ensure car exists
  //   await this.carsService.findById(carId);
  //   const auction = new this.auctionModel({ car: carId, startDate, endDate });
  //   return auction.save();
  // }

  async createForCar(
    carId: string,
    startDate: Date,
    endDate: Date,
    startingPrice: number,
  ) {
    const now = new Date();

    // Validate dates
    if (startDate <= now) {
      throw new BadRequestException('startDate must be a future date');
    }

    if (endDate <= now) {
      throw new BadRequestException('endDate must be a future date');
    }

    if (endDate <= startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }

    // ensure car exists
    await this.carsService.findById(carId);

    const auction = new this.auctionModel({
      // car: carId,
      car : new Types.ObjectId(carId),   // ✅ convert to ObjectId
      startDate,
      endDate,
      currentBid: startingPrice,
    });

    return auction.save();
  }

  async findAll() {
    return this.auctionModel.find().populate('car').exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new NotFoundException('Auction not found');
    const a = await this.auctionModel
      .findById(id)
      .populate('car')
      .populate('currentBidder', '-password')
      .exec();
    if (!a) throw new NotFoundException('Auction not found');
    return a;
  }

  async start(id: string) {
    const auction = await this.auctionModel.findById(id).exec();
    if (!auction) throw new NotFoundException('Auction not found');
    auction.status = 'live';
    await auction.save();
    this.websocket.emitBidStarted({ auctionId: auction._id, car: auction.car });
    return auction;
  }

  async end(id: string) {
    const auction = await this.auctionModel.findById(id).exec();
    if (!auction) throw new NotFoundException('Auction not found');
    auction.status = 'ended';
    // winner is currentBidder
    auction.winner = auction.currentBidder;
    await auction.save();
    this.websocket.emitBidEnded({
      auctionId: auction._id,
      winner: auction.winner,
    });
    if (auction.winner)
      this.websocket.emitBidWinner({
        auctionId: auction._id,
        winner: auction.winner,
      });
    return auction;
  }

  async updateBid(
    auctionId: string,
    amount: number,
    bidderId: string,
    bidId: string,
  ) {
    const auction = await this.auctionModel.findById(auctionId).exec();
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.status !== 'live')
      throw new BadRequestException('Auction is not live');
    if (amount <= auction.currentBid)
      throw new BadRequestException('Bid must be higher than current bid');
    auction.currentBid = amount;
    // auction.currentBidder = bidderId;

    // use this:
    auction.currentBidder = new Types.ObjectId(bidderId);

    auction.topBidders = [...auction.topBidders, new Types.ObjectId(bidId)];
    await auction.save();
    this.websocket.emitNewBid({ auctionId, amount, bidderId });
    return auction;
  }

  async markCompleted(id: string) {
    const auction = await this.auctionModel.findById(id).exec();
    if (!auction) throw new NotFoundException('Auction not found');
    auction.status = 'completed';
    await auction.save();
    return auction;
  }
}
