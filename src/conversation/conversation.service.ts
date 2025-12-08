import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { UpdateGroupConversationDto } from './dto/update-group-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { Conversation } from './schemas/conversation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { RemoveParticipantsDto } from './dto/remove-participants.dto';
import { MessageDocument } from 'src/message/schemas/message.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private userService: UserService,
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
      isActive: true,
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
      isActive: true,
    };

    if (cursor) query.lastMessageAt = { $lt: new Date(cursor) };

    const conversations = await this.conversationModel
      .find(query)
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 })
      .limit(limit + 1)
      .populate('participants', 'name avatar')
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'sender',
          select: 'name _id',
        },
      })
      .lean();

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;

    const resultItems = items.map((conversation) => {
      const seenBy = conversation.lastMessage?.seenBy || [];
      const isLastMessageSeen = seenBy.some(
        (userId: any) => userId.toString() === currentUser._id.toString(),
      );

      return {
        ...conversation,
        isLastMessageSeen,
      };
    });

    return {
      items: resultItems,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].updatedAt : null,
    };
  }

  async findOne(id: string) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate('participants');
    if (!conversation || !conversation.isActive)
      throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async updateGroup(
    id: string,
    updateGroupConversationDto: UpdateGroupConversationDto,
    currentUser: IUserPayload,
  ) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isActive)
      throw new NotFoundException('Conversation not found');
    if (currentUser._id !== conversation.groupOwner?._id.toString())
      throw new ForbiddenException(
        'You are not able to delete this conversation',
      );

    const { groupAvatar, groupName } = updateGroupConversationDto;

    conversation.groupAvatar = groupAvatar ?? conversation.groupAvatar;
    conversation.groupName = groupName ?? conversation.groupName;

    return conversation.save();
  }

  async addParticipants(
    id: string,
    currentUser: IUserPayload,
    addParticipantsDto: AddParticipantsDto,
  ) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isGroup || !conversation.isActive)
      throw new NotFoundException('Conversation/Group not found');

    if (conversation.groupOwner?._id.toString() !== currentUser._id)
      throw new ForbiddenException(
        'You are not allowed to add participants to this group',
      );

    const { participantsIds } = addParticipantsDto;

    const existingParticipantsIds = conversation.participants.map((p) =>
      p._id.toString(),
    );

    const participantsDocuments: UserDocument[] = [];

    for (const participantId of participantsIds) {
      if (existingParticipantsIds.includes(participantId)) return;
      const userDocument = await this.userService.findOne(participantId);
      participantsDocuments.push(userDocument);
    }

    conversation.participants = [
      ...conversation.participants,
      ...participantsDocuments,
    ];

    conversation.save();
  }

  async removeParticipants(
    id: string,
    currentUser: IUserPayload,
    removeParticipantsDto: RemoveParticipantsDto,
  ) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isGroup || !conversation.isActive)
      throw new NotFoundException('Conversation/Group not found');

    if (conversation.groupOwner?._id.toString() !== currentUser._id)
      throw new ForbiddenException(
        'You are not allowed to remove participants from this group',
      );

    const { participantsIds } = removeParticipantsDto;

    if (participantsIds.includes(currentUser._id))
      throw new BadRequestException('Cannot remove the owner');

    const filteredParticipants = conversation.participants.filter(
      (p) => !participantsIds.includes(p._id.toString()),
    );

    conversation.participants = [...filteredParticipants];

    conversation.save();
  }

  async remove(id: string, currentUser: IUserPayload) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isActive)
      throw new NotFoundException('Conversation not found');

    if (
      conversation.isGroup &&
      conversation?.groupOwner?._id.toString() !== currentUser._id
    )
      throw new ForbiddenException(
        'You are not allowed to remove this conversation',
      );

    conversation.isActive = false;
    conversation.save();
  }

  async updateLastMessage(id: string, messageId: string) {
    const conversation = await this.conversationModel.findByIdAndUpdate(
      id,
      { lastMessage: messageId },
      { new: true },
    );

    if (!conversation) throw new NotFoundException('Conversation not found');
  }

  async updateLastMessageAt(conversationId: string, message: MessageDocument) {
    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: message.createdAt,
    });
  }
}
