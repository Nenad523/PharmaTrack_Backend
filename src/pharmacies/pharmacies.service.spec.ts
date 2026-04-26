import { Test, TestingModule } from '@nestjs/testing';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesRepository } from './pharmacies-repository.service';
import { SearchDto } from './dto/search-dto';

describe('PharmaciesService', () => {
  let service: PharmaciesService;
  let pharmaciesRepository: { searchPharmacies: jest.Mock };

  beforeEach(async () => {
    pharmaciesRepository = {
      searchPharmacies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmaciesService,
        {
          provide: PharmaciesRepository,
          useValue: pharmaciesRepository,
        },
      ],
    }).compile();

    service = module.get<PharmaciesService>(PharmaciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return repository results', async () => {
    const dto = { doseIds: [1] } as SearchDto;
    const expectedResponse = { success: true, data: [], count: 0 };

    pharmaciesRepository.searchPharmacies.mockResolvedValue(expectedResponse);

    await expect(service.searchPharmacies(dto)).resolves.toEqual(expectedResponse);
    expect(pharmaciesRepository.searchPharmacies).toHaveBeenCalledWith(dto);
  });
});
