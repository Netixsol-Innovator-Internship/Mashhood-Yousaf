import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  emitNewBid(payload: any) {
    this.server.emit('newBid', payload);
  }
  emitBidStarted(payload: any) {
    this.server.emit('bidStarted', payload);
  }
  emitBidEnded(payload: any) {
    this.server.emit('bidEnded', payload);
  }
  emitBidWinner(payload: any) {
    this.server.emit('bidWinner', payload);
  }
  emitPaymentProgress(payload: any) {
    this.server.emit('paymentProgress', payload);
  }
}
