import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Injectable()
export class NotificationsService {

    constructor(private repo: RepositoryService) {}

    async subscribe(userId: number, doseId: number) {
        return this.repo.subscribe(userId, doseId);
    }

    async unsubscribe(userId: number, notificationId: number) {
        return this.repo.unsubscribe(userId, notificationId);
    }

    async getMyNotifications(userId: number) {
        return this.repo.getUserNotifications(userId);
    }
}
