import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, IPaginationInput } from '@as/contracts';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const exists = await this.userRepository.exists({
      email: createUserDto.email,
    });
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    return this.userRepository.create(createUserDto);
  }

  async findAll(pagination?: IPaginationInput) {
    // If pagination parameters are provided, use findPaginated
    if (pagination && (pagination.page || pagination.limit)) {
      return this.userRepository.findPaginated(pagination);
    }
    // Otherwise, return all
    return this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if it exists before trying to update
    await this.findById(id);

    const updatedUser = await this.userRepository.update(id, updateUserDto);
    return updatedUser;
  }

  async delete(id: string) {
    // Check if it exists before trying to delete
    await this.findById(id);

    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) {
      throw new Error(`Failed to delete user with ID ${id}`);
    }
    return { deleted: true };
  }
}
