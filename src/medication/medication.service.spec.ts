import { Test, TestingModule } from '@nestjs/testing';
import { MedicationService } from './medication.service';
import { MedicationRepository } from './medication-repository.service';

describe('MedicationService', () => {
  let service: MedicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        { provide: MedicationRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
