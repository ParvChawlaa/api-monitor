import { ApisService } from '../src/apis/apis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ApisController } from '../src/apis/apis.controller';

describe('ApisService', () => {
  let service: ApisService;
  let controller: ApisController;

  const mockApisService = {
    validateUser: jest.fn(),
    validLink: jest.fn(),
    listApis: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApisController],
      providers: [ApisService],
    })
      .overrideProvider(ApisService)
      .useValue(mockApisService)
      .compile();
    controller = module.get<ApisController>(ApisController);
    service = module.get<ApisService>(ApisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should validate user credentials', async () => {
    mockApisService.validateUser.mockResolvedValue(true);
    const result = await service.validateUser('testuser', 'password123');
    expect(result).toBe(true);
    expect(mockApisService.validateUser).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should check if API link is valid', async () => {
    mockApisService.validLink.mockResolvedValue(true);
    const result = await service.validLink('EX_LINK');
    expect(result).toBe(true);
    expect(mockApisService.validLink).toHaveBeenCalledWith('EX_LINK');
  });

  it('should list APIs for a user with pagination', async () => {
    const mockApis = [{ name: 'API 1' }, { name: 'API 2' }];
    mockApisService.listApis.mockResolvedValue(mockApis);
    
    const result = await service.listApis('user123', 1, 10);
    expect(result).toEqual(mockApis);
    expect(mockApisService.listApis).toHaveBeenCalledWith('user123', 1, 10);
  });
});
