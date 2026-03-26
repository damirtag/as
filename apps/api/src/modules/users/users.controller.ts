import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './users.service';
import { PaginationDto } from '@as/contracts';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
