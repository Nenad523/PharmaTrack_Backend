import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryService } from './repository.service';
import { DatabaseService } from '../database/database.service';

describe('RepositoryService', () => {
  let service: RepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryService,
        { provide: DatabaseService, useValue: {} },
      ],
    }).compile();

    service = module.get<RepositoryService>(RepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
