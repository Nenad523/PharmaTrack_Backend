import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtOrSessionGuard } from '../common/guards/jwt-or-session.guard';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { SavePushTokenDto } from './dto/save-push-token.dto';
import { SavePreferencesDto } from './dto/save-preferences.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';

@Controller('api/v1/notifications')
@UseGuards(JwtOrSessionGuard)
export class NotificationsController {
    constructor(private service: NotificationsService) {}

    @ApiOperation({ summary: 'Sačuvaj Expo push token uređaja' })
    @Post('push-token')
    savePushToken(@Body() dto: SavePushTokenDto, @Request() req: any) {
        return this.service.savePushToken(req.user.id, dto.token);
    }

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

    @ApiOperation({ summary: 'Dohvati podešavanja obavještenja' })
    @Get('preferences')
    getPreferences(@Request() req: any) {
        return this.service.getPreferences(req.user.id);
    }

    @ApiOperation({ summary: 'Sačuvaj podešavanja obavještenja' })
    @Patch('preferences')
    savePreferences(@Body() dto: SavePreferencesDto, @Request() req: any) {
        return this.service.saveEmailPreference(req.user.id, dto.email_enabled);
    }
}
