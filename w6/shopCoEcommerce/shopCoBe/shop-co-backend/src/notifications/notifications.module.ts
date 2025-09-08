// src/notifications/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
