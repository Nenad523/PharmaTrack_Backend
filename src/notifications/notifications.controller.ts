import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SessionGuard } from '../common/guards/session.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';

@Controller('api/v1/notifications')
@UseGuards(SessionGuard)
export class NotificationsController {
    constructor(private service: NotificationsService) {}

    @ApiOperation({ summary: 'Pretplati se na obavijest za dozu' })
    @Post()
    subscribe(@Body() dto: CreateNotificationDto, @Request() req: any) {
        return this.service.subscribe(req.user.id, dto.dose_id);
    }

    @ApiOperation({ summary: 'Otkaži pretplatu na obavijest' })
    @Delete(':id')
    unsubscribe(@Param('id', ParsePositiveIntPipe) id: number, @Request() req: any) {
        return this.service.unsubscribe(req.user.id, id);
    }

    @ApiOperation({ summary: 'Lista mojih pretplata na obavijesti' })
    @Get()
    getMyNotifications(@Request() req: any) {
        return this.service.getMyNotifications(req.user.id);
    }
}
