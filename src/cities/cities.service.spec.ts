import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { DatabaseService } from '../database/database.service';

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        { provide: DatabaseService, useValue: {} },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
