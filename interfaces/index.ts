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
    _id?: string;
    publicId?: string;
    title: string,
    description: string,
    owner?:{
        name: string;
        username: string;
        avatarUrl: string;
        headLine: string
    },
    githubUrl: string,
    websiteUrl: string,
    status: "active" | "archived" | "in progress",
    techStackNeeded: string[],
    rolesNeeded: { role: string; count: number }[],
    tags: string[];
    createdAt?: string;
    updatedAt?: string;
}