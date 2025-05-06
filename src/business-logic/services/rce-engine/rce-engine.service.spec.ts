import { Test, TestingModule } from '@nestjs/testing';
import { RceEngineService } from './rce-engine.service';

describe('RceEngineService', () => {
  let service: RceEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RceEngineService],
    }).compile();

    service = module.get<RceEngineService>(RceEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
