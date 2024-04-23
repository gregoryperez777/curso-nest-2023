import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { MessagesWsService } from './messages-ws.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;
  
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly JwtService: JwtService
  ) {}
  
  async handleConnection(client: Socket) {
    // console.log('Cliente ->', client)

    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.JwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // console.log({ payload })

    
  
    this.wss.emit('client-update', this.messagesWsService.getConnectedClient())
  }

  handleDisconnect(client: Socket) {
    // console.log('Cliente desconectado', client.id);
    this.messagesWsService.removeClient(client.id);

    this.wss.emit('client-update', this.messagesWsService.getConnectedClient())
   
  }

  //message-from-client
  // Este decorador por proporciona nest
  // para suscribirnos a los eventos desde el 
  // front
  @SubscribeMessage('message-from-client')
  handleMessageFromClient( client: Socket, payload: NewMessageDto ) {
    

    //! Emite unicamente al cliente no a todos 
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   messages: payload.message || 'no message'
    // })

    // Emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   messages: payload.message || 'no message'
    // })

    // Emitir a todos INCLUYENDO, al cliente inicial
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message'
    })
  }

}