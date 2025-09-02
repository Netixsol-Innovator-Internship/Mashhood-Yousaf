import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CarsModule } from './cars/cars.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BidsModule } from './bids/bids.module';
import { PaymentsModule } from './payments/payments.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mashhoodyousaf:mashhoodyousaf@cluster0.cfu4bld.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    AuthModule,
    CarsModule,
    AuctionsModule,
    BidsModule,
    PaymentsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
