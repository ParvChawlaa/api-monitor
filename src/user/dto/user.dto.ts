import { IsString, IsNotEmpty, IsBoolean,IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123',
    description: 'The username',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123',
    description: 'The password of user',
  })
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    example: false,
    description: 'The soft deleted flag',
  })
  status: boolean;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 25,
    description: 'The call limit for the user',
  })
  callLimit: number;
}
