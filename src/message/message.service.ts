import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserService } from 'src/user/user.service';
import { MessageGateway } from './message.gateway';
import { plainToInstance } from 'class-transformer';
import { ResponseMessageDto } from './dto/response-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    private conversationService: ConversationService,
    private userService: UserService,
    private messageGateway: MessageGateway,
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
      text,
      mediaFiles,
    });

    const savedMessage = await message.save();

    await this.conversationService.updateLastMessage(
      conversationId,
      savedMessage._id.toString(),
    );

    // Here, for ws, we re-create the message like the one we get on response,
    // the one that dto creates:

    const newMessage = await this.messageModel
      .findById(savedMessage._id)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar');

    // This is just the thing we used on transform dto:
    const responseMessage = plainToInstance(ResponseMessageDto, newMessage, {
      excludeExtraneousValues: true,
    });

    this.messageGateway.handleNewMessage(conversationId, responseMessage);
  }

  async getAllMessages(conversationId: string, limit: number, cursor: string) {
    const query: Record<string, any> = {
      conversation: conversationId,
      isDeleted: false,
    };

    if (cursor) query.createdAt = { $gt: new Date(cursor) };

    const messages = await this.messageModel
      .find(query)
      .sort({ createdAt: 1 })
      .limit(limit + 1)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar');

    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, limit) : messages;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null,
    };
  }

  findAll() {
    return `This action returns all message`;
  }

  async findOne(id: string) {
    const message = await this.messageModel.findById({
      _id: id,
      isDeleted: false,
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
    currentUser: IUserPayload,
  ) {
    const message = await this.findOne(id);

    if (message.sender._id.toString() !== currentUser._id)
      throw new ForbiddenException('You are not allowed to edit this message');

    const { mediaFiles, text } = updateMessageDto;

    message.text = text ?? message.text;
    message.mediaFiles = mediaFiles ?? message.mediaFiles;
    message.isEdited ||= true;

    const newMessage = await this.messageModel
      .findById(message._id)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar');

    const responseMessage = plainToInstance(ResponseMessageDto, newMessage, {
      excludeExtraneousValues: true,
    });

    this.messageGateway.handleUpdateMessage(
      message.conversation._id.toString(),
      responseMessage,
    );

    return await message.save();
  }

  async remove(id: string, currentUser: IUserPayload) {
    const message = await this.findOne(id);
    if (message.sender._id.toString() !== currentUser._id)
      throw new ForbiddenException(
        'You are not allowed to delete this message',
      );
    message.isDeleted = true;
    message.save();
  }

  async markMessageAsSeen(id: string, currentUser: IUserPayload) {
    const message = await this.findOne(id);
    const alreadySeen = message.seenBy.some(
      (u) => u._id.toString() === currentUser._id,
    );
    if (alreadySeen) return;
    if (currentUser._id === message.sender._id.toString()) return;
    const userDocument = await this.userService.findOne(currentUser._id);
    message.seenBy.push(userDocument);
    message.isSeen ||= true;
    message.save();
  }
}
