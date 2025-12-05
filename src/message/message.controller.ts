import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponseMessageDto } from './dto/response-message.dto';

@Controller('messages')
@UseGuards(AuthGuard)
@TransformDTO(ResponseMessageDto)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/conversation/:conversationId')
  create(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.messageService.sendMessage(
      conversationId,
      sendMessageDto,
      currentUser,
    );
  }

  @Get('/conversation/:conversationId')
  getAllMessages(
    @Param('conversationId', ParseObjectIdPipe) conversationId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('cursor') cursor: string,
  ) {
    return this.messageService.getAllMessages(conversationId, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.messageService.update(id, updateMessageDto, currentUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
