import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':auctionId')
  async make(
    @Req() req: any,
    @Param('auctionId') auctionId: string,
    @Body() body: any,
  ) {
    const { amount } = body;
    return this.paymentsService.makePayment(req.user.userId, auctionId, amount);
  }

  @Get(':auctionId/status')
  async status(@Param('auctionId') auctionId: string) {
    return this.paymentsService.getStatus(auctionId);
  }
}
