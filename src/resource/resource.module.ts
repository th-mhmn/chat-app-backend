import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema, Post } from 'src/post/schemas/post.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
