import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }
}
