import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '@app/user/infraestructure/user.service';
import { MessageResponse } from '@app/shared/domain/model/message.response';
import { UserCreateDto } from '@app/user/domain/dto/user-create.dto';
import { AuthGuard } from '@app/shared/infraestructure/guards/auth.guard';

@Controller('users')
export class UserController {

  /**
   * Inyeccion de dependencias.
   * @param userService 
   */
  constructor(private readonly userService: UserService) { }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('')
  async create(@Body() userDto: UserCreateDto): Promise<MessageResponse> {
    
    const response = await this.userService.create(userDto);
    return response;
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @Get('')  
  async gets(): Promise<MessageResponse> {

    const response = await this.userService.gets();
    return response;
  }
  
  @UseGuards(AuthGuard)
  @Get('/:id')
  async get(@Param('id', ParseIntPipe) userId: number): Promise<MessageResponse> {

    const response = await this.userService.get(userId);
    return response;
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard)
  @Put('/:id')
  async update(@Body() userDto: UserCreateDto, @Param('id', ParseIntPipe) userId: number): Promise<MessageResponse> {
    
    return await this.userService.update(userId, userDto);
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) userId: number): Promise<MessageResponse> {

    const response = await this.userService.delete(userId);
    return response;
  }  
}
