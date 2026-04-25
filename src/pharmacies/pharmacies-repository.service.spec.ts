import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PharmaciesRepository } from './pharmacies-repository.service';
import { DatabaseService } from '../database/database.service';
import {
  PharmacyAvailabilityRow,
  PharmacyDoseRow,
  PharmacySearchRow,
} from './types/mainSearch.type';

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

  it('should merge availability data and apply open filters', async () => {
    const pharmacyRows: PharmacySearchRow[] = [
      {
        id: 1,
        name: 'Apoteka 1',
        address: 'Adresa 1',
        city: 'Podgorica',
        latitude: 42.43,
        longitude: 19.26,
        distance: 1.2,
      },
      {
        id: 2,
        name: 'Apoteka 2',
        address: 'Adresa 2',
        city: 'Podgorica',
        latitude: 42.44,
        longitude: 19.27,
        distance: 2.4,
      },
      {
        id: 3,
        name: 'Apoteka 3',
        address: 'Adresa 3',
        city: 'Podgorica',
        latitude: 42.45,
        longitude: 19.28,
        distance: 3.1,
      },
    ];

    const availabilityRows: PharmacyAvailabilityRow[] = [
      {
        pharmacyId: 1,
        dutyEnd: '2026-04-25 23:00:00',
        hasClosedExceptionToday: false,
        activeExceptionClose: null,
        workingHoursClose: '20:00:00',
      },
      {
        pharmacyId: 2,
        dutyEnd: null,
        hasClosedExceptionToday: false,
        activeExceptionClose: '13:00:00',
        workingHoursClose: null,
      },
      {
        pharmacyId: 3,
        dutyEnd: null,
        hasClosedExceptionToday: true,
        activeExceptionClose: null,
        workingHoursClose: '18:00:00',
      },
    ];

    const doseRows: PharmacyDoseRow[] = [
      {
        pharmacyId: 1,
        doseId: 1,
        strength: '500mg',
        lastUpdated: '2026-04-25 10:00:00',
      },
      {
        pharmacyId: 2,
        doseId: 1,
        strength: '500mg',
        lastUpdated: '2026-04-25 10:05:00',
      },
    ];

    databaseService.query
      .mockResolvedValueOnce(pharmacyRows)
      .mockResolvedValueOnce(availabilityRows)
      .mockResolvedValueOnce(doseRows);

    const response = await service.searchPharmacies({
      doseIds: [1],
      sort: 'az',
      openNow: true,
      onDuty: true,
    });

    expect(response.count).toBe(1);
    expect(response.data).toHaveLength(1);
    expect(response.data[0]).toMatchObject({
      id: 1,
      isOpenNow: true,
      isOnDuty: true,
      openUntil: '2026-04-25 23:00:00',
      availabilitySource: 'duty',
    });
    expect(response.data[0].doses).toHaveLength(1);
  });
});
