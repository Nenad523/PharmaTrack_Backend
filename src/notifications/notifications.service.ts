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

    async savePushToken(userId: number, token: string) {
        return this.repo.savePushToken(userId, token);
    }

    async getPreferences(userId: number) {
        return this.repo.getPreferences(userId);
    }

    async saveEmailPreference(userId: number, enabled: boolean) {
        return this.repo.saveEmailPreference(userId, enabled);
    }

    async triggerForDose(doseId: number, pharmacyName: string) {
        console.log(`[triggerForDose] Pokrenuto za doseId=${doseId}, apoteka=${pharmacyName}`);

        const subscribers = await this.repo.getSubscribersForDose(doseId);
        console.log(`[triggerForDose] Pronađeno pretplatnika: ${subscribers.length}`);

        if (subscribers.length === 0) return;

        const emailNotifiedIds: number[] = [];
        const pushNotifiedIds: number[] = [];

        await Promise.allSettled(
            subscribers
                .filter(sub => sub.email_notifications_enabled === 1)
                .map(async (sub) => {
                    try {
                        console.log(`[triggerForDose] Slanje emaila na: ${sub.user_email}`);
                        await this.emailService.sendAvailabilityNotification(
                            sub.user_email,
                            sub.medication_name,
                            sub.strength,
                            pharmacyName,
                        );
                        console.log(`[triggerForDose] Email uspješno poslan na: ${sub.user_email}`);
                        emailNotifiedIds.push(sub.notification_id);
                    } catch (err) {
                        console.error(`[triggerForDose] Greška pri slanju emaila na ${sub.user_email}:`, err);
                    }
                })
        );

        const pushMessages = subscribers
            .filter(sub => sub.expo_push_token !== null)
            .map(sub => ({
                to: sub.expo_push_token!,
                title: 'Lijek je dostupan',
                body: `${sub.medication_name} ${sub.strength} je sada dostupan u apoteci ${pharmacyName}.`,
                sound: 'default' as const,
                data: { notification_id: sub.notification_id },
            }));

        if (pushMessages.length > 0) {
            console.log(`[triggerForDose] Slanje push notifikacija: ${pushMessages.length}`);
            const pushRes = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(pushMessages),
            }).catch(err => { console.error('[triggerForDose] Push greška:', err); return null; });

            if (pushRes?.ok) {
                subscribers
                    .filter(sub => sub.expo_push_token !== null)
                    .forEach(sub => pushNotifiedIds.push(sub.notification_id));
            }
        }

        const allNotifiedIds = [...new Set([...emailNotifiedIds, ...pushNotifiedIds])];
        console.log(`[triggerForDose] Označavam kao notified: ${allNotifiedIds}`);
        await this.repo.markAsNotified(allNotifiedIds);
    }
}
