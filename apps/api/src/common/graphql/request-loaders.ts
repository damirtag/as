import { Injectable } from '@nestjs/common';
import { IPaginationInput } from '@as/contracts';
import { CommentService } from '../../modules/comments/comments.service';
import { ReactionService } from '../../modules/reactions/reactions.service';
import { PresenceService } from '../../modules/presence/presence.service';

type BatchFunction<K, V> = (keys: readonly K[]) => Promise<ReadonlyArray<V>>;

class BatchLoader<K, V> {
  private readonly cache = new Map<K, Promise<V>>();
  private queue: K[] = [];
  private pending = new Map<
    K,
    { resolve: (value: V) => void; reject: (error: unknown) => void }[]
  >();
  private scheduled = false;

  constructor(private readonly batch: BatchFunction<K, V>) {}

  load(key: K): Promise<V> {
    const cached = this.cache.get(key);
    if (cached) return cached;

    const promise = new Promise<V>((resolve, reject) => {
      const waiters = this.pending.get(key) ?? [];
      waiters.push({ resolve, reject });
      this.pending.set(key, waiters);
      this.queue.push(key);
    });
    this.cache.set(key, promise);

    if (!this.scheduled) {
      this.scheduled = true;
      queueMicrotask(() => void this.flush());
    }

    return promise;
  }

  private async flush(): Promise<void> {
    const keys = [...new Set(this.queue)];
    this.queue = [];
    this.scheduled = false;

    try {
      const values = await this.batch(keys);
      if (values.length !== keys.length) {
        throw new Error(
          'GraphQL batch loader returned an invalid result length',
        );
      }
      keys.forEach((key, index) => {
        this.pending.get(key)?.forEach(({ resolve }) => resolve(values[index]));
        this.pending.delete(key);
      });
    } catch (error) {
      keys.forEach((key) => {
        this.pending.get(key)?.forEach(({ reject }) => reject(error));
        this.pending.delete(key);
        this.cache.delete(key);
      });
    }
  }
}

type PaginatedKey = { id: string; pagination: IPaginationInput };

@Injectable()
export class RequestLoadersFactory {
  constructor(
    private readonly comments: CommentService,
    private readonly reactions: ReactionService,
    private readonly presence: PresenceService,
  ) {}

  create() {
    const commentsSummary = new BatchLoader<string, { totalCount: number }>(
      (ids) => this.comments.getQuoteCommentsSummaries([...ids]),
    );
    const reactionsSummary = new BatchLoader<
      string,
      { totalCount: number; counts: unknown[] }
    >((ids) => this.reactions.getQuoteReactionsSummaries([...ids]));
    const commentsPaginated = new BatchLoader<PaginatedKey, unknown>((keys) =>
      this.comments.findCommentsPaginatedByQuoteIds([...keys]),
    );
    const reactionsPaginated = new BatchLoader<PaginatedKey, unknown>((keys) =>
      this.reactions.findQuoteReactionsPaginatedByQuoteIds([...keys]),
    );
    const presence = new BatchLoader<
      string,
      { isOnline: boolean; lastSeenAt: Date | null }
    >((ids) => Promise.all(ids.map((id) => this.presence.getStatus(id))));

    return {
      commentsSummary,
      reactionsSummary,
      commentsPaginated,
      reactionsPaginated,
      presence,
    };
  }
}

export type RequestLoaders = ReturnType<RequestLoadersFactory['create']>;

export type GraphQLContext = {
  req: unknown;
  res: unknown;
  loaders: RequestLoaders;
};
