import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private conversationService: ConversationService,
  ) {}

  async sendMessage(
    conversationId: string,
    sendMessageDto: SendMessageDto,
    currentUser: IUserPayload,
  ) {
    const { text, mediaFiles } = sendMessageDto;

    const message = await new this.messageModel({
      conversation: conversationId,
      sender: currentUser._id,
      seenBy: [currentUser._id],
      text,
      mediaFiles,
    });

    await this.conversationService.updateLastMessage(
      conversationId,
      message._id.toString(),
    );

    return message.save();
  }

  async getAllMessages(conversationId: string) {
    const messages = await this.messageModel
      .find({
        conversation: conversationId,
      })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar');

    return messages;
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
