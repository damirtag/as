import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { IJwtPayload, User } from '@as/contracts';
import { UserService } from '../users/users.service';
import { PresenceService } from './presence.service';

type AuthenticatedSocket = Socket & { data: { user?: User } };

@WebSocketGateway({
  namespace: '/presence',
  cors: { origin: true, credentials: true },
})
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly presenceService: PresenceService,
  ) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const user = await this.authenticate(client);
      client.data.user = user;
      await this.presenceService.connect(user.id, client.id);

      const status = await this.presenceService.getStatus(user.id);
      this.server.emit('presence:changed', {
        userId: user.id,
        isOnline: status.isOnline,
        lastSeenAt: status.lastSeenAt,
      });
    } catch {
      client.emit('presence:error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
    const user = client.data.user;
    if (!user) return;

    const status = await this.presenceService.disconnect(user.id, client.id);
    if (!status.isOnline) {
      this.server.emit('presence:changed', {
        userId: user.id,
        isOnline: false,
        lastSeenAt: status.lastSeenAt,
      });
    }
  }

  @SubscribeMessage('presence:heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: AuthenticatedSocket) {
    const user = client.data.user;
    if (!user) throw new UnauthorizedException();

    const acknowledged = await this.presenceService.heartbeat(user.id, client.id);
    if (!acknowledged) {
      client.disconnect(true);
      return { ok: false };
    }
    return { ok: true };
  }

  private async authenticate(client: Socket): Promise<User> {
    const token = this.extractToken(client);
    if (!token) throw new UnauthorizedException();

    const payload = await this.jwt.verifyAsync<IJwtPayload>(token);
    if (payload.type === 'refresh') throw new UnauthorizedException();
    return this.userService.findByIdOrFail(payload.sub);
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === 'string' && authToken) return authToken;

    const authorization = client.handshake.headers.authorization;
    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice('Bearer '.length);
    }
    return null;
  }
}