import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ResultSetHeader } from 'mysql2';
import { NotificationItem, NotificationSubscriber } from './types/notification.type';

@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService) {}

    async subscribe(userId: number, doseId: number) {
        try {
            const dose = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Doses WHERE id = ? AND isActive = 1',
                [doseId]
            );

            if (dose.length === 0)
                throw new NotFoundException(`Doza sa ID-em ${doseId} ne postoji.`);

            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Notifications WHERE user_id = ? AND dose_id = ?',
                [userId, doseId]
            );

            if (existing.length > 0)
                throw new ConflictException('Već ste pretplaćeni na obavijesti za ovu dozu.');

            const result = await this.db.query<ResultSetHeader>(
                'INSERT INTO Notifications (user_id, dose_id) VALUES (?, ?)',
                [userId, doseId]
            );

            return { success: true, id: result.insertId };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri pretplati.');
        }
    }

    async unsubscribe(userId: number, notificationId: number) {
        try {
            const existing = await this.db.query<{ id: number }[]>(
                'SELECT id FROM Notifications WHERE id = ? AND user_id = ?',
                [notificationId, userId]
            );

            if (existing.length === 0)
                throw new NotFoundException('Notifikacija ne postoji.');

            await this.db.query(
                'DELETE FROM Notifications WHERE id = ?',
                [notificationId]
            );

            return { success: true };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri otkazivanju pretplate.');
        }
    }

    async getUserNotifications(userId: number) {}

    async getSubscribersForDose(doseId: number): Promise<NotificationSubscriber[]> { return []; }

    async markAsNotified(notificationIds: number[]) {}
}
