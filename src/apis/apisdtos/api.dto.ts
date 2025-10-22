import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsIn,
  IsObject,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApiDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123',
    description: 'The user ID',
  })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'google',
    description: 'The name of the API',
  })
  apiName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://www.google.com/',
    description: 'API endpoint',
  })
  apiLink: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'GET',
    description: 'Method of the API',
  })
  @IsIn(['Get', 'POST', 'PUT'])
  method: string;

  @IsNumber()
  @ApiProperty({
    example: 10,
    description:
      'how many times the API is called every hour to measure statistics',
  })
  callFrequency: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: {
      Authorization: 'Bearer token',
      'Content-Type': 'application/json',
    },
    description: 'HTTP headers as JSON object',
    required: false,
  })
  header: Record<string, any>;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    example: {
      userId: 123,
      action: 'create',
      data: { name: 'John Doe' },
    },
    description: 'Request body as JSON object',
    required: false,
  })
  body: Record<string, any>;

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({
    example: true,
    description: 'Whether the API is active',
  })
  status: boolean;
}
