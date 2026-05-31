import { Injectable } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { EmailService } from '../authentication/email.service';

@Injectable()
export class NotificationsService {

    constructor(
        private repo: RepositoryService,
        private emailService: EmailService,
    ) {}

    async subscribe(userId: number, doseId: number) {
        return this.repo.subscribe(userId, doseId);
    }

    async unsubscribe(userId: number, notificationId: number) {
        return this.repo.unsubscribe(userId, notificationId);
    }

    async getMyNotifications(userId: number) {
        return this.repo.getUserNotifications(userId);
    }

    async triggerForDose(doseId: number, pharmacyName: string) {
        const subscribers = await this.repo.getSubscribersForDose(doseId);
        if (subscribers.length === 0) return;

        const notifiedIds: number[] = [];

        await Promise.allSettled(
            subscribers.map(async (sub) => {
                try {
                    await this.emailService.sendAvailabilityNotification(
                        sub.user_email,
                        sub.medication_name,
                        sub.strength,
                        pharmacyName,
                    );
                    notifiedIds.push(sub.notification_id);
                } catch {}
            })
        );

        await this.repo.markAsNotified(notifiedIds);
    }
}
