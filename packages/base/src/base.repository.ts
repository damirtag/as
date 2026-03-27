import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  ObjectLiteral,
} from "typeorm";
import { IPaginatedResult, IPaginationInput } from "@as/contracts";

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.repo.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  async findPaginated(
    pagination: IPaginationInput,
    options?: FindManyOptions<T>,
  ): Promise<IPaginatedResult<T>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repo.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repo.findOne({ where });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    // Reload so all columns (including FK columns like userId) are populated
    return this.repo.findOneOrFail({ where: { id: (saved as any).id } });
  }

  async save(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T | null> {
    await this.repo.update(id, data as never);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repo.count({ where });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    return (await this.repo.count({ where })) > 0;
  }
}
