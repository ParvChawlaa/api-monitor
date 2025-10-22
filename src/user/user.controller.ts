import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('register')
  async register(@Body() userDto: UserDto) {
    return this.userService.register(userDto);
  }
  @Delete('delete/:username')
  async delete(@Param('username') username: string) {
    return this.userService.delete(username);
  }
}
