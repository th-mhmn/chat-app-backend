import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UploadMediaDto } from './../_cores/globals/dtos';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findAll() {
    return this.userModel.find({ isActive: true });
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
    console.log(user);
    if (!user) throw new NotFoundException('User not found');

    user.avatar = uploadMediaDto;
    return user.save();
  }
}
