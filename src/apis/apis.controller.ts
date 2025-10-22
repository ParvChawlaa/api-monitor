import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ApisService } from './apis.service';
import { ApiDto } from './apisdtos/api.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('apis')
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @Post('AddApiInfo')
  @UseGuards(AuthGuard)
  async addApiInfo(@Body() infoInDto: ApiDto) {
    return this.apisService.addApiInfo(infoInDto);
  }
  @UseGuards(AuthGuard)
  @Get('GetApiInfo/:apiid')
  async getApiInfo(@Param('apiid') apiid: string) {
    return this.apisService.getApiInfo(apiid);
  }

  @Put('UpdateApiInfo/:newName/:newFrequency/:apiid')
  @UseGuards(AuthGuard)
  async updateApiInfo(
    @Param('newName') newName: string,
    @Param('newFrequency') newFrequency: number,
    @Param('apiid') apiid: string,
  ) {
    return await this.apisService.updateApiInfo(apiid, newName, newFrequency);
  }

  @UseGuards(AuthGuard)
  @Delete('DeleteApiInfo/:apiid')
  async deleteApiInfo(@Param('apiid') apiid: string) {
    return await this.apisService.deleteApiInfo(apiid);
  }

  @Get('listApis/:userId')
  @UseGuards(AuthGuard)
  async listApis(@Param('userId') userId: string) {
    return await this.apisService.listApis(userId, 1, 2);
  }

  @Get('getApiLogs/:apiid')
  @UseGuards(AuthGuard)
  async getApiLogs(@Param('apiid') apiid: string) {
    return await this.apisService.getApiLogs(apiid, 1, 10);
  }
}
