import { Test, TestingModule } from '@nestjs/testing';
import { PharmaciesController } from './pharmacies.controller';
import { PharmaciesService } from './pharmacies.service';
import { SearchDto } from './dto/search-dto';

describe('PharmaciesController', () => {
  let controller: PharmaciesController;
  let pharmaciesService: { searchPharmacies: jest.Mock };

  beforeEach(async () => {
    pharmaciesService = {
      searchPharmacies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmaciesController],
      providers: [
        {
          provide: PharmaciesService,
          useValue: pharmaciesService,
        },
      ],
    }).compile();

    controller = module.get<PharmaciesController>(PharmaciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate search to the service', async () => {
    const dto = { doseIds: [1] } as SearchDto;
    const expectedResponse = { success: true, data: [], count: 0 };

    pharmaciesService.searchPharmacies.mockResolvedValue(expectedResponse);

    await expect(controller.searchPharmacies(dto)).resolves.toEqual(expectedResponse);
    expect(pharmaciesService.searchPharmacies).toHaveBeenCalledWith(dto);
  });
});
