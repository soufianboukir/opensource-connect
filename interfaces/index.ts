export interface User {
    _id: string
    name: string
    email: string
    username: string
    avatarUrl?: string
    githubUrl: string
    experienceLevel: string
    openToWork: boolean
    headLine: string
    techStack: string[]
}


export interface Notification{
  _id: string;
    user: {
        name: string;
        avatarUrl: string;
        username: string
    };
    fromUser?: {
        name: string;
        avatarUrl: string;
        username: string
    };
    type: 'system' | 'project application' | 'propose collaboration' | 'project app rejected' | 'collaboration rejected' | 'project app accepted' | 'collaboration accepted';
    message: string;
    read: boolean;
    link: string;
    createdAt: Date;
}

export interface Project{
    _id?: string;
    publicId?: string;
    title: string,
    description: string,
    owner?:{
        _id: string;
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
    createdAt: string;
    updatedAt?: string;
}

export interface Application {
  _id: string
  applicant: {
    _id: string
    name: string
    email: string
    username: string
    avatarUrl?: string
    githubUrl: string
    experienceLevel: string
    openToWork: boolean
    headLine: string
  }
  toUser: {
    _id: string
    name: string
    email: string
    username: string
    avatarUrl?: string
    githubUrl: string
    experienceLevel: string
    openToWork: boolean
    headLine: string
  }
  project?: Project
  type: 'project application' | 'propose collaboration'
  message?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}


export interface Message{
    _id: string;
    conversation: Conversation;
    sender: {
        _id: string,
        name: string,
        username: string,
        avatarUrl: string
    };
    text: string;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Conversation {
  _id: string;
    participants: {
      user: {
        _id: string,
        name: string,
        username: string,
        avatarUrl: string,
      }[],
    };
    project?: {
        publicId: string
    };
    lastMessage?: Message;
    updatedAt: Date;
    createdAt: Date;
}