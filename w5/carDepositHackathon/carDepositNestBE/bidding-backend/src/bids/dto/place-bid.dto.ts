// src/bids/dto/place-bid.dto.ts
import { IsNotEmpty, IsNumber, IsMongoId, Min } from 'class-validator';

export class PlaceBidDto {
  @IsNotEmpty()
  @IsMongoId()
  auctionId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
