import { BadRequestException, Injectable } from '@nestjs/common';
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

  findAll(currentUser: IUserPayload) {
    return this.conversationModel.find({
      participants: { $in: [currentUser._id] },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
