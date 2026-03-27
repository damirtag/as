import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class ReactionRepository extends BaseRepository<Reaction> {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {
    super(reactionRepository);
  }
}
