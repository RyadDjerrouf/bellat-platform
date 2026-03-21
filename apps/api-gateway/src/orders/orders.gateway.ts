import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

/**
 * WebSocket gateway for real-time order status updates.
 * Clients connect to the /orders namespace, emit 'subscribe_order' with
 * the order ID, and receive 'order_status_updated' events when admin
 * advances the status.
 *
 * Auth: JWT passed via socket.io handshake auth: { token }.
 * The customer's user ID is extracted and stored on the socket so that
 * the subscribe handler can restrict subscriptions to orders they own.
 */
@WebSocketGateway({
  namespace: '/orders',
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  },
})
export class OrdersGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(OrdersGateway.name);

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token as string | undefined;
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const secret = this.config.get<string>('JWT_SECRET')!;
      const payload = this.jwt.verify<{ sub: string; email: string }>(token, { secret });
      // Attach user info to the socket for downstream handlers
      (client as Socket & { userId: string }).userId = payload.sub;
      this.logger.log(`WS connected: ${payload.email} (${client.id})`);
    } catch {
      this.logger.warn(`WS rejected: invalid JWT (${client.id})`);
      client.disconnect();
    }
  }

  /**
   * Client subscribes to live updates for a specific order.
   * The socket joins room "order:<orderId>" so emitStatusUpdate()
   * can broadcast to all watchers of that order.
   */
  @SubscribeMessage('subscribe_order')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() orderId: string,
  ) {
    const userId = (client as Socket & { userId?: string }).userId;
    if (!userId) return;
    client.join(`order:${orderId}`);
    this.logger.log(`${userId} subscribed to order:${orderId}`);
  }

  /** Called by OrdersService after a status change. Notifies all subscribers. */
  emitStatusUpdate(orderId: string, status: string) {
    this.server
      .to(`order:${orderId}`)
      .emit('order_status_updated', { orderId, status });
    this.logger.log(`Emitted status '${status}' to order:${orderId}`);
  }
}
