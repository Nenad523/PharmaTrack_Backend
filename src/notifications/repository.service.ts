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

    async getUserNotifications(userId: number) {
        try {
            const rows = await this.db.query<NotificationItem[]>(
                `SELECT
                    N.id,
                    N.dose_id,
                    M.name AS medication_name,
                    D.strength,
                    N.is_notified,
                    N.created_at
                FROM Notifications N
                JOIN Doses D ON D.id = N.dose_id
                JOIN Medication M ON M.id = D.medication_id
                WHERE N.user_id = ?
                ORDER BY N.created_at DESC`,
                [userId]
            );

            return { success: true, data: rows, count: rows.length };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Došlo je do greške pri dohvatanju notifikacija.');
        }
    }

    async getSubscribersForDose(doseId: number): Promise<NotificationSubscriber[]> {
        try {
            return await this.db.query<NotificationSubscriber[]>(
                `SELECT
                    N.id AS notification_id,
                    U.email AS user_email,
                    M.name AS medication_name,
                    D.strength
                FROM Notifications N
                JOIN Users U ON U.id = N.user_id
                JOIN Doses D ON D.id = N.dose_id
                JOIN Medication M ON M.id = D.medication_id
                WHERE N.dose_id = ? AND N.is_notified = 0`,
                [doseId]
            );
        } catch (error) {
            throw new InternalServerErrorException('Došlo je do greške pri dohvatanju pretplatnika.');
        }
    }

    async markAsNotified(notificationIds: number[]) {
        if (notificationIds.length === 0) return;
        try {
            const placeholders = notificationIds.map(() => '?').join(', ');
            await this.db.query(
                `UPDATE Notifications SET is_notified = 1 WHERE id IN (${placeholders})`,
                notificationIds
            );
        } catch (error) {
            throw new InternalServerErrorException('Došlo je do greške pri ažuriranju statusa notifikacija.');
        }
    }
}
