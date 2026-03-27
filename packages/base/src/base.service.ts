import { NotFoundException, ConflictException } from "@nestjs/common";
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  DeepPartial,
} from "typeorm";
import { IPaginationInput, IPaginatedResult } from "@as/contracts";
import { BaseRepository } from "./base.repository";

export abstract class BaseService<T extends ObjectLiteral> {
  protected constructor(protected readonly repo: BaseRepository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.findAll(options);
  }

  async findPaginated(
    pagination: IPaginationInput,
    options?: FindManyOptions<T>,
  ): Promise<IPaginatedResult<T>> {
    return this.repo.findPaginated(pagination, options);
  }

  async findByIdOrFail(id: string): Promise<T> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `${this.entityName()} with ID ${id} not found`,
      );
    }
    return entity;
  }

  async findOneOrFail(where: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.repo.findOne(where);
    if (!entity) {
      throw new NotFoundException(`${this.entityName()} not found`);
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return this.repo.create(data);
  }

  async save(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  async updateOrFail(id: string, data: DeepPartial<T>): Promise<T> {
    await this.findByIdOrFail(id);
    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new NotFoundException(
        `${this.entityName()} with ID ${id} not found`,
      );
    }
    return this.findByIdOrFail(id);
  }

  async deleteOrFail(id: string): Promise<void> {
    await this.findByIdOrFail(id);
    const deleted = await this.repo.delete(id);
    if (!deleted) {
      throw new NotFoundException(
        `${this.entityName()} with ID ${id} not found`,
      );
    }
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    return this.repo.exists(where);
  }

  async ensureExists(
    where: FindOptionsWhere<T>,
    message?: string,
  ): Promise<void> {
    const exists = await this.repo.exists(where);
    if (!exists) {
      throw new NotFoundException(message ?? `${this.entityName()} not found`);
    }
  }

  async ensureNotExists(
    where: FindOptionsWhere<T>,
    message?: string,
  ): Promise<void> {
    const exists = await this.repo.exists(where);
    if (exists) {
      throw new ConflictException(
        message ?? `${this.entityName()} already exists`,
      );
    }
  }

  private entityName(): string {
    return this.constructor.name.replace("Service", "");
  }
}
