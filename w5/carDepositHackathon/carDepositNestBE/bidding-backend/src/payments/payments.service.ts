import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';
import { AuctionsService } from '../auctions/auctions.service';
import { UsersService } from '../users/users.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { Types } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private auctionsService: AuctionsService,
    private usersService: UsersService,
    private websocket: WebsocketGateway,
  ) {}

  async makePayment(userId: string, auctionId: string, amount: number) {
    const auction: any = await this.auctionsService.findById(auctionId);
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.winner && auction.winner.toString() !== userId) {
      // if a winner exists but user isn't winner, only allow if user is the winner
      throw new BadRequestException('Only winner can make payment');
    }
    // create payment doc
    const p = new this.paymentModel({
      user: userId,
      auction: auctionId,
      amount,
      status: 'pending',
    });
    const saved = await p.save();

    // simulate progress every 60s (for demonstration). You may change interval in real app.
    // this.simulateDelivery(saved._id.toString());
    this.simulateDelivery((saved._id as Types.ObjectId).toString());

    return saved;
  }

  async getStatus(auctionId: string) {
    return this.paymentModel.findOne({ auction: auctionId }).exec();
  }

  private simulateDelivery(paymentId: string) {
    // Fetch and update statuses every 60s: pending -> in-transit -> delivered -> completed
    const intervals: number[] = [60 * 1000, 60 * 1000, 60 * 1000]; // three steps 60s each
    let step = 0;
    const steps = ['in-transit', 'delivered', 'completed'];

    const tick = async () => {
      const p = await this.paymentModel.findById(paymentId).exec();
      if (!p) return clearInterval(timer);
      if (step >= steps.length) {
        clearInterval(timer);
        // after completed mark auction completed:
        await this.auctionsService.markCompleted(p.auction.toString());
        return;
      }
      p.status = steps[step];
      await p.save();
      this.websocket.emitPaymentProgress({
        paymentId: p._id,
        auctionId: p.auction,
        status: p.status,
      });
      step++;
    };

    const timer = setInterval(tick, intervals[0]);
    // run first tick after 1 second to move pending -> in-transit sooner (optional)
    setTimeout(tick, 1000);
  }
}
