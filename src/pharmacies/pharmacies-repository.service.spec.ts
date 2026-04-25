import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PharmaciesRepository } from './pharmacies-repository.service';
import { DatabaseService } from '../database/database.service';

describe('PharmaciesRepository', () => {
  let service: PharmaciesRepository;
  let databaseService: { query: jest.Mock };

  beforeEach(async () => {
    databaseService = {
      query: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmaciesRepository,
        {
          provide: DatabaseService,
          useValue: databaseService,
        },
      ],
    }).compile();

    service = module.get<PharmaciesRepository>(PharmaciesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject radius without coordinates', async () => {
    await expect(
      service.searchPharmacies({
        doseIds: [1],
        radius: 5,
        sort: 'az',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should reject distance sort without coordinates', async () => {
    await expect(
      service.searchPharmacies({
        doseIds: [1],
        sort: 'distance',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
