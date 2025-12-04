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
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conversation.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseConversationDto } from './dto/response-conversation-dto';

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
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
