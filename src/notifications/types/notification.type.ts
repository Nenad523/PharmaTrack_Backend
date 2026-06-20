export type NotificationItem = {
    id: number;
    dose_id: number;
    medication_name: string;
    strength: string;
    is_notified: number;
    created_at: string;
};

export type NotificationSubscriber = {
    notification_id: number;
    user_email: string;
    expo_push_token: string | null;
    email_notifications_enabled: number;
    medication_name: string;
    strength: string;
};
