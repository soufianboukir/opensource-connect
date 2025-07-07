import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }

  interface Profile{
    picture: string;
    avatar_url: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    avatarUrl?: string;
  }
}

