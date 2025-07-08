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

export interface Project{
    title: string,
    description: string,
    githubUrl: string,
    websiteUrl: string,
    status: "active" | "archived" | "in progress",
    techStackNeeded: string[],
    rolesNeeded: { role: string; count: number }[],
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
}