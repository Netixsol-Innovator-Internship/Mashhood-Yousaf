// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop([
    {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },
  ])
  addresses: any[];

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'Product',
    },
  ])
  wishlist: any[];

  @Prop({ default: true })
  isActive: boolean;
  // OTP Verification Fields
  // @Prop({ default: false })
  // emailVerified: boolean;

  // @Prop({ type: String, required: false })
  // emailVerificationOtp?: string | null;

  // @Prop({ type: Date, required: false })
  // otpExpiresAt?: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
