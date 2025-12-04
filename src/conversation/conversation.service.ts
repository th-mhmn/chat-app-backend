import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { Conversation } from './schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
  ) {}

  async createPrivate(
    createPrivateConversationDto: CreatePrivateConversationDto,
    currentUser: IUserPayload,
  ) {
    const { participantId } = createPrivateConversationDto;

    if (currentUser._id === participantId)
      throw new BadRequestException(
        'You cannot create a conversation with yourself',
      );

    const existingConversation = await this.conversationModel.findOne({
      isGroup: false,
      participants: { $all: [currentUser._id, participantId] },
    });

    if (existingConversation) return existingConversation;

    const conversation = new this.conversationModel({
      iSGroup: false,
      participants: [currentUser._id, participantId],
    });

    return conversation.save();
  }

  createGroup(
    createGroupConversationDto: CreateGroupConversationDto,
    currentUser: IUserPayload,
  ) {
    const { participantIds, groupName, groupAvatar } =
      createGroupConversationDto;
    if (participantIds.includes(currentUser._id))
      throw new BadRequestException(
        'You cannot create a group with your own id in participants array',
      );
    const conversation = new this.conversationModel({
      isGroup: true,
      groupName,
      groupAvatar,
      groupOwner: currentUser._id,
      participants: [currentUser._id, ...participantIds],
    });

    return conversation.save();
  }

  async findAll(currentUser: IUserPayload, limit: number, cursor: string) {
    const query: Record<string, any> = {
      participants: { $in: [currentUser._id] },
    };

    if (cursor) query.updatedAt = { $lt: new Date(cursor) };

    const conversations = await this.conversationModel
      .find(query)
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .limit(limit + 1)
      .populate('participants', 'name avatar')
      .lean();

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].updatedAt : null,
    };
  }

  async findOne(id: string) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('participants');
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
