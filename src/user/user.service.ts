import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schema/user.schema';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(userDto: UserDto) {
    const existingUser = await this.userModel.findOne({
      username: userDto.username,
      status: false
    });
    if (existingUser) {
      return { message: 'User already exists' };
    }
    const user = await this.userModel.create({
      ...userDto,
      password: await bcrypt.hash(userDto.password, 10),
      status: false,
    });
    return user;
  }

  async delete(username: string) {
    const user = await this.userModel.findOne({
      username: username,
      status: false,
    });
    if (!user) {
      return { message: 'User not found' };
    }
    await this.userModel.findByIdAndUpdate(user._id, { status: true });
    return { message: 'User deleted successfully' };
  }
}
