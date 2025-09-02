import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bids')
export class BidsController {
  constructor(private bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async place(@Req() req: any, @Body() body: any) {
    if(!body) {
      throw new  BadRequestException('Fields is missing')
    }
    const { auctionId, amount } = body;
    
    return this.bidsService.placeBid(req.user.userId, auctionId, amount);
  }

  @Get(':auctionId')
  async list(@Param('auctionId') auctionId: string) {
    return this.bidsService.findByAuction(auctionId);
  }
}
