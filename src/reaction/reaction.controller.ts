import { Controller, Get } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get()
  findAll() {
    return this.reactionService.findAll();
  }
}
