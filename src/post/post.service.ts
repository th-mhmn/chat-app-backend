import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeleteMediaDto, DeleteMultipleMediaDto } from './dto/delete-media.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
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
}
