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
        console.log(`[triggerForDose] Pokrenuto za doseId=${doseId}, apoteka=${pharmacyName}`);

        const subscribers = await this.repo.getSubscribersForDose(doseId);
        console.log(`[triggerForDose] Pronađeno pretplatnika: ${subscribers.length}`);

        if (subscribers.length === 0) return;

        const notifiedIds: number[] = [];

        await Promise.allSettled(
            subscribers.map(async (sub) => {
                try {
                    console.log(`[triggerForDose] Slanje emaila na: ${sub.user_email}`);
                    await this.emailService.sendAvailabilityNotification(
                        sub.user_email,
                        sub.medication_name,
                        sub.strength,
                        pharmacyName,
                    );
                    console.log(`[triggerForDose] Email uspješno poslan na: ${sub.user_email}`);
                    notifiedIds.push(sub.notification_id);
                } catch (err) {
                    console.error(`[triggerForDose] Greška pri slanju emaila na ${sub.user_email}:`, err);
                }
            })
        );

        console.log(`[triggerForDose] Označavam kao notified: ${notifiedIds}`);
        await this.repo.markAsNotified(notifiedIds);
    }
}
