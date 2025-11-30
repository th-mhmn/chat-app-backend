import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { Roles } from 'src/_cores/decorators/roles.decorator';
import { TransformDTO } from 'src/_cores/interceptors/transform-dto.interceptor';
import { ResponsePostDto } from './dto/response-post.dto';
import { CurrentUser } from 'src/_cores/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { DeleteMediaDto, DeleteMultipleMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { RemoveReactionDto } from './dto/remove-reaction.dto';
import { UploadMediaDto } from 'src/_cores/globals/dtos';

@Controller('posts')
@TransformDTO(ResponsePostDto)
@UseGuards(AuthGuard, RoleGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.postService.create(createPostDto, currentUser);
  }

  @Post(':id/upload')
  uploadMedia(
    @Body() uploadMediaDto: UploadMediaDto[],
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.postService.uploadMedia(id, uploadMediaDto);
  }

  @Delete(':id/delete')
  deleteMedia(
    @Body() deleteMediaDto: DeleteMediaDto,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.postService.deleteMedia(id, deleteMediaDto);
  }

  @Delete(':id/delete-multiple')
  deleteMultipleMedia(
    @Body() deleteMultipleMediaDto: DeleteMultipleMediaDto,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.postService.deleteMultipleMedia(id, deleteMultipleMediaDto);
  }

  @Post('reaction')
  addReaction(
    @Body() addReactionDto: AddReactionDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.postService.addReaction(addReactionDto, currentUser);
  }

  @Delete('reaction')
  removeReaction(
    @Body() removeReactionDto: RemoveReactionDto,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.postService.removeReaction(removeReactionDto, currentUser);
  }

  @Get()
  findAll(@CurrentUser() currentUser: IUserPayload) {
    return this.postService.findAll(currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() currentUser: IUserPayload,
  ) {
    return this.postService.findOneWithMyReaction(id, currentUser);
  }

  @Roles('admin', 'user')
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postService.remove(id);
  }
}
