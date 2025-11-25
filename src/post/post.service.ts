import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeleteMediaDto, DeleteMultipleMediaDto } from './dto/delete-media.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private reactionService: ReactionService,
    private cloudinaryService: CloudinaryService,
  ) {}

  create(createPostDto: CreatePostDto, currentUser: IUserPayload) {
    const post = new this.postModel({ ...createPostDto, author: currentUser });
    return post.save();
  }

  async uploadMedia(id: string, uploadMediaDto: UploadMediaDto[]) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    uploadMediaDto.forEach((mediaDto) => post.mediaFiles.push(mediaDto));
    await post.save();
  }

  async deleteMedia(id: string, deleteMediaDto: DeleteMediaDto) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    this.cloudinaryService.deleteFile(deleteMediaDto.public_id);

    post.mediaFiles = post.mediaFiles.filter(
      (media) => media.public_id !== deleteMediaDto.public_id,
    );
    await post.save();
  }

  async deleteMultipleMedia(
    id: string,
    { public_ids }: DeleteMultipleMediaDto,
  ) {
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');

    this.cloudinaryService.deleteMultipleFiles(public_ids);

    public_ids.forEach((public_id) => {
      post.mediaFiles = post.mediaFiles.filter(
        (media) => media.public_id !== public_id,
      );
    });

    await post.save();
  }

  findAll() {
    return this.postModel.find().populate('author');
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) throw new NotFoundException('Post not found');
    return `This action removes a #${id} post`;
  }

  async addReaction(addReactionDto: AddReactionDto, currentUser: IUserPayload) {
    const { postId, type } = addReactionDto;
    const existingReaction = await this.reactionService.findExisting(
      postId,
      currentUser._id,
    );

    if (existingReaction) {
      if (type === existingReaction.type) return;
      await this.reactionService.update(existingReaction._id.toString(), type);
    } else {
      await this.reactionService.create(addReactionDto, currentUser);
    }
  }
}
