export interface Notification{
    user: {
        name: string;
        avatarUrl: string;
    };
    fromUser?: {
        name: string;
        avatarUrl: string;
    };
    type: 'system' | 'apply';
    message: string;
    read: boolean;
    link?: string;
    createdAt: Date;
}