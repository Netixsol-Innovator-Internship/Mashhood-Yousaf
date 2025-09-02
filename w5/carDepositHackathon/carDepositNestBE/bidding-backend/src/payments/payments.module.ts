import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AuctionsModule } from '../auctions/auctions.module';
import { UsersModule } from '../users/users.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    AuctionsModule,
    UsersModule,
    WebsocketModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
