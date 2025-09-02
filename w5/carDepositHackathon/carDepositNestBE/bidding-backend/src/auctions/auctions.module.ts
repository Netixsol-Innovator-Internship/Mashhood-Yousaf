import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { CarsModule } from '../cars/cars.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }]),
    CarsModule,
    WebsocketModule,
  ],
  providers: [AuctionsService],
  controllers: [AuctionsController],
  exports: [AuctionsService],
})
export class AuctionsModule {}
