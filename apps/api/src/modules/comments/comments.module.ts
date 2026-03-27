import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '@as/contracts';
import { CommentService } from './comments.service';
import { CommentRepository } from './comments.repository';
import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentService, CommentRepository, CommentsResolver],
  exports: [CommentService],
})
export class CommentModule {}
