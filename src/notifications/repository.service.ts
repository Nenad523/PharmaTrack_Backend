import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationItem, NotificationSubscriber } from './types/notification.type';

@Injectable()
export class RepositoryService {

    constructor(private db: DatabaseService) {}

    async subscribe(userId: number, doseId: number) {}

    async unsubscribe(userId: number, notificationId: number) {}

    async getUserNotifications(userId: number) {}

    async getSubscribersForDose(doseId: number): Promise<NotificationSubscriber[]> { return []; }

    async markAsNotified(notificationIds: number[]) {}
}
