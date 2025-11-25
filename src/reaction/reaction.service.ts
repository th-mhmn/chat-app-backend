import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction } from './schemas/reaction.schema';
import { Model } from 'mongoose';
import { AddReactionDto } from 'src/post/dto/add-reaction.dto';

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}
  create(addReactionDto: AddReactionDto, currentUser: IUserPayload) {
    const reaction = new this.reactionModel({
      post: addReactionDto.postId,
      type: addReactionDto.type,
      user: currentUser,
    });
    return reaction.save();
  }

  findAll() {
    return `This action returns all reaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  async findExisting(postId: string, userId: string) {
    return await this.reactionModel.findOne({ post: postId, user: userId });
  }

  async update(id: string, type: IReaction) {
    const reaction = await this.reactionModel.findByIdAndUpdate(
      id,
      { type },
      { new: true },
    );

    if (!reaction) throw new NotFoundException('Reaction not found');

    return reaction;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
