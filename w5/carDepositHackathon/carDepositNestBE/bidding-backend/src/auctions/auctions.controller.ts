import { Controller, Post, Param, UseGuards, Body, Get } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    // Convert string dates to Date objects
    const startDate = new Date(createAuctionDto.startDate);
    const endDate = new Date(createAuctionDto.endDate);

    return this.auctionsService.createForCar(
      createAuctionDto.car,
      startDate,  // Date object
      endDate,    // Date object
      createAuctionDto.startingPrice,
    );
  }

  @Get()
  async list() {
    return this.auctionsService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.auctionsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  async start(@Param('id') id: string) {
    return this.auctionsService.start(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/end')
  async end(@Param('id') id: string) {
    return this.auctionsService.end(id);
  }
}
