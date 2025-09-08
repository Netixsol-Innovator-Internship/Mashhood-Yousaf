// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://mashhoodyousaf24_db_user:shop.Co@shopcocluster.2oxtg3o.mongodb.net/shopco?retryWrites=true&w=majority&appName=shopCoCluster',
    ),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    AnalyticsModule,
    UploadModule,
  ],
})
export class AppModule {}
