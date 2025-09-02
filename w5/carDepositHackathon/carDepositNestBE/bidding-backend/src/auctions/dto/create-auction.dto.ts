// src/auctions/dto/create-auction.dto.ts
import {
  IsNotEmpty,
  IsDateString,
  IsMongoId,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  @IsMongoId()
  car: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  startingPrice: number;
}
