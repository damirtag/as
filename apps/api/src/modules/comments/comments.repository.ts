import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, IPaginationInput, IPaginatedResult } from '@as/contracts';
import { BaseRepository } from '@as/base';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super(commentRepository);
  }

  async findCommentsPaginatedByQuoteId(
    quoteId: string,
    pagination: IPaginationInput,
  ): Promise<IPaginatedResult<Comment>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo
      .createQueryBuilder("comment")
      .where("comment.quoteId = :quoteId", { quoteId })
      .orderBy("comment.createdAt", "DESC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
