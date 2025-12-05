import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { UpdateGroupConversationDto } from './dto/update-group-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseConversationDto } from './dto/response-conversation-dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { RemoveParticipantsDto } from './dto/remove-participants.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
@TransformDTO(ResponseConversationDto)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('/private')
  createPrivate(
    @Body() createPrivateConversationDto: CreatePrivateConversationDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.createPrivate(
      createPrivateConversationDto,
      currentUser,
    );
  }

  @Post('/group')
  create(
    @Body() createGroupConversationDto: CreateGroupConversationDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.createGroup(
      createGroupConversationDto,
      currentUser,
    );
  }

  @Get()
  findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('cursor') cursor: string,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.findAll(currentUser, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch('/group/:id')
  updateGroup(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGroupConversationDto: UpdateGroupConversationDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.updateGroup(
      id,
      updateGroupConversationDto,
      currentUser,
    );
  }

  @Patch('/group/:id/members')
  addParticipants(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() addParticipantsDto: AddParticipantsDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.addParticipants(
      id,
      currentUser,
      addParticipantsDto,
    );
  }

  @Delete('/group/:id/members')
  removeParticipants(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() removeParticipantsDto: RemoveParticipantsDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.removeParticipants(
      id,
      currentUser,
      removeParticipantsDto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.conversationService.remove(id, currentUser);
  }
}
