import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApisController } from './apis.controller';
import { ApisService } from './apis.service';
import { ApiInfo, ApiInfoSchema } from './schemas/apis.schema';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { User, UserSchema } from '../user/schema/user.schema';
import { ApiLogs, ApiLogsSchema } from '../api-logs/schemas/api-logs.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 30,
      max: 100,
    }),
    HttpModule,
    MongooseModule.forFeature([
      { name: ApiInfo.name, schema: ApiInfoSchema },
      { name: User.name, schema: UserSchema },
      { name: ApiLogs.name, schema: ApiLogsSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ApisController],
  providers: [ApisService],
})
export class ApisModule {}
