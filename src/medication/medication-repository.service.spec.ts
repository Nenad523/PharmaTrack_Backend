import { Test, TestingModule } from '@nestjs/testing';
import { MedicationRepository } from './medication-repository.service';

describe('MedicationRepositoryService', () => {
  let service: MedicationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationRepository],
    }).compile();

    service = module.get<MedicationRepository>(MedicationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
