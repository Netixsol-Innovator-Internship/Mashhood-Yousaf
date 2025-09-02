import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { AuctionsModule } from '../auctions/auctions.module';
import { CarsModule } from '../cars/cars.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    AuctionsModule,
    CarsModule,
    UsersModule,
  ],
  providers: [BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
