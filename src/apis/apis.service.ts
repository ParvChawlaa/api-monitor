import { Injectable, Inject } from '@nestjs/common';
import { ApiDto } from './apisdtos/api.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiInfo } from './schemas/apis.schema';
import { HttpService } from '@nestjs/axios';
import { User } from '../user/schema/user.schema';
import { ApiLogs } from '../api-logs/schemas/api-logs.schema';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as bcrypt from 'bcrypt';
@Injectable()
export class ApisService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(ApiInfo.name) private apiInfoModel: Model<ApiInfo>,
    @InjectModel(ApiLogs.name) private apiLogsModel: Model<ApiLogs>,
    private readonly httpService: HttpService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addApiInfo(ApiInfoDto: ApiDto) {
    //// looking for duplicate (link,method,header,body)
    const exsistingApi = await this.apiInfoModel.findOne({
      ApiLink: ApiInfoDto.apiLink,
      Method: ApiInfoDto.method,
      header: ApiInfoDto.header,
      body: ApiInfoDto.body,
      status: false,
    });
    if (exsistingApi) {
      return { message: 'API already exists' };
    }
    const createdObject = await this.apiInfoModel.create(ApiInfoDto);
    const id = this.startMeasuring(
      ApiInfoDto.callFrequency,
      ApiInfoDto.apiLink,
      ApiInfoDto.method,
      ApiInfoDto.header,
      ApiInfoDto.body,
      createdObject._id.toString(),
    );
    this.apiIdToIntervalId.set(createdObject._id.toString(), await id);
    return createdObject;
  }

  async getApiInfo(apiId: string) {
    //return await this.apiInfoModel.findById(apiId).where({status: false});
    const cachedData = await this.cacheManager.get(apiId);
    if (cachedData) {
      console.log('cached data');
      return cachedData;
    }

    const ans = await this.apiInfoModel
      .findById(apiId)
      .where({ status: false });
    this.cacheManager.set(apiId, ans, 6000);
    console.log('not cached data');
    return ans;
  }

  async updateApiInfo(apiid: string, newName: string, newFrequency: number) {
    this.cacheManager.del(apiid);
    const updatedApi = await this.apiInfoModel.findByIdAndUpdate(
      apiid,
      { status: false },
      {
        ApiName: newName,
        CallFrequency: newFrequency,
      },
    );
    this.stopMeasuring(apiid);

    if (updatedApi) {
      this.startMeasuring(
        newFrequency,
        updatedApi.apiLink,
        updatedApi.method,
        updatedApi.header,
        updatedApi.body,
        apiid,
      );
    } else {
      return { message: "coudn't update api" };
    }

    return updatedApi;
  }

  async deleteApiInfo(apiid: string) {
    this.stopMeasuring(apiid);
    return await this.apiInfoModel.findByIdAndUpdate(apiid, {
      status: true,
    });
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.find({
      username: username,
      status: false,
    });
    if (user.length == 0) return false;
    if (await bcrypt.compare(password, user[0].password)) return true;

    return false;
  }

  async getApiLogs(apiid: string, page: number, limit: number) {
    const apiExists = await this.apiInfoModel
      .findById(apiid)
      .where({ status: false });
    if (!apiExists) {
      return { message: 'API not found' };
    }
    return await this.apiLogsModel
      .find({ apiId: apiid })
      .skip((page - 1) * limit)
      .limit(limit);
  }
  async validLink(apiLink: string) {
    try {
      await this.httpService
        .request({ url: apiLink, method: 'GET' })
        .toPromise();
    } catch (error) {
      console.log('Error: ' + error.message);
      return false;
    }
    return true;
  }

  async callApi(
    apiLink: string,
    method: string,
    headers: object,
    body: object,
  ) {
    const startTime = performance.now();
    const response = await this.httpService
      .request({ url: apiLink, method: method, headers: headers, data: body })
      .toPromise();
    const endTime = performance.now();
    return {
      status: response?.status,
      responseTime: endTime - startTime,
      responseBody: response?.data,
    };
  }

  async startMeasuring(
    intervalMs: number,
    apiLink: string,
    method: string,
    headers: object,
    body: object,
    apiId: string,
  ) {
    const intervalId = setInterval(async () => {
      //////// to check if the link is valid
      if ((await this.validLink(apiLink)) == false) return;
      //////// actual call to the API
      const response = await this.callApi(apiLink, method, headers, body);

      /////////// inserting in batches of 10
      this.batchOfLogs.push({
        apiId: apiId,
        logs: {
          Timestamp: new Date(),
          Status: response?.status,
          ResponseTime: response?.responseTime,
          RequestBody: body,
          RequestHeaders: headers,
          ResponseBody: response?.responseBody,
        },
      });
      console.log('size of batch' + this.batchOfLogs.length);
      if (this.batchOfLogs.length >= 10) {
        const tempBatchOfLogs = this.batchOfLogs;
        this.batchOfLogs = [];
        await this.apiLogsModel.insertMany(tempBatchOfLogs);
        console.log('batch inserted');
      }
      console.log(apiLink, response?.responseTime);
    }, intervalMs);

    this.apiIdToIntervalId.set(apiId, intervalId);
    return intervalId;
  }
  private batchOfLogs: Record<string, any>[] = [];
  private apiIdToIntervalId = new Map<string, NodeJS.Timeout>();

  async stopMeasuring(apiId: string) {
    const intervalId = this.apiIdToIntervalId.get(apiId);
    clearInterval(intervalId);
  }

  async listApis(userId: string, page: number, limit: number) {
    return await this.apiInfoModel
      .find({ userId: userId, status: false })
      .skip((page - 1) * limit)
      .limit(10);
  }
}
