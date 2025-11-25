import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get()
  findAll() {
    return this.reactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionService.remove(+id);
  }
}
