import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Injectable()
export class AdminService {

    constructor(private repo: RepositoryService) {}
}
