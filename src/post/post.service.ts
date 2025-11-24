import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  create(createPostDto: CreatePostDto, currentUser: IUserPayload) {
    const post = new this.postModel({ ...createPostDto, author: currentUser });
    return post.save();
  }

  findAll() {
    return this.postModel.find().populate('author');
  }

  findOne(id: string) {
    return this.postModel.findById(id);
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const post = this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
