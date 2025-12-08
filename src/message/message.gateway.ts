import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ResponseMessageDto } from './dto/response-message.dto';
@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connect ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnect ${client.id}`);
  }

  @SubscribeMessage('message')
  handleEvent(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(conversationId);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return data;
  }

  handleNewMessage(conversationId: string, data: ResponseMessageDto) {
    this.server.to(conversationId).emit('new_message', data);
  }

  handleUpdateMessage(conversationId: string, data: ResponseMessageDto) {
    this.server.to(conversationId).emit('update_message', data);
  }

  handleRemoveMessage(conversationId: string, messageId: string) {
    this.server.to(conversationId).emit('remove_message', messageId);
  }

  handleMarkMessageAsSeen(
    conversationId: string,
    messageId: string,
    seenBy: { seenById: string; seenByName: string; seenByAvatarUrl: string },
  ) {
    this.server.to(conversationId).emit('seen_message', { messageId, seenBy });
  }
}
