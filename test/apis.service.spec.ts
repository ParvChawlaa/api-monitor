import {ApisService} from '../src/apis/apis.service';
import { Test, TestingModule } from '@nestjs/testing';
import {ApisController} from '../src/apis/apis.controller';

describe('ApisService', () => {
  let service: ApisService;
  let controller: ApisController;

  const mockApisService = {

  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApisController],
      providers: [ApisService],
    }).overrideProvider(ApisService).useValue(mockApisService) .compile();
    controller = module.get<ApisController>(ApisController);
    service = module.get<ApisService>(ApisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
