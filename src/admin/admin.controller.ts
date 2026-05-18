import { Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/api/v1/admin')
export class AdminController {

    constructor(private service: AdminService) {}

    @ApiOperation({ summary : 'Kreiranje novog lijeka.'})
    @Post('/medication')
    async create
}
