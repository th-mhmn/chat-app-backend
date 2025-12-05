import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UploadMediaDto } from './../_cores/globals/dtos';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(q: string, limit: number, cursor: string) {
    const query: Record<string, any> = { isActive: true };
    if (q && q.trim() !== '') {
      query.$or = [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    if (cursor) query.name = { $gt: cursor };

    const users = await this.userModel
      .find(query)
      .sort({ username: 1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = users.length > limit;
    const items = hasNextPage ? users.slice(0, 1) : users;

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? users[users.length - 1].username : null,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  getCurrentUser(currentUser: IUserPayload) {
    return this.userModel.findById(currentUser._id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto },
      {
        new: true,
      },
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, {
      isActive: false,
    });
    if (!user) throw new NotFoundException('User not found');
  }

  async uploadAvatar(
    uploadMediaDto: UploadMediaDto,
    currentUser: IUserPayload,
  ) {
    const user = await this.userModel.findById(currentUser._id);

    if (!user) throw new NotFoundException('User not found');

    user.avatar = uploadMediaDto;
    return user.save();
  }
}
