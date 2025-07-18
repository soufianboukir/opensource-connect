import { dbConnection } from "@/config/db";
import User from "@/models/user.model";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Notification from "@/models/notification.model";
import { sendRegistrationEmail } from "./mail";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile?.email) return false;
    
      await dbConnection();
      const email = profile.email;
      let user = await User.findOne({ email });
    
      if (user) {
        if (!user.username) {
          user.username = account.provider === "github"
            ? (profile as any).login
            : profile.email?.split("@")[0];
        }
    
        if (!user.name) {
          user.name = profile.name;
        }
    
        if (!user.avatarUrl) {
          user.avatarUrl = profile.picture || (profile as any).avatar_url;
        }
    
        await user.save();
      } else {
        user = await User.create({
          name: profile.name,
          email,
          avatarUrl: profile.picture || (profile as any).avatar_url,
          username: account.provider === "github"
            ? (profile as any).login
            : profile.email?.split("@")[0],
        });

        await sendRegistrationEmail({toEmail: user.email, name: user.name})
    
        await Notification.create({
          user: user._id,
          type: "system",
          message: `🎉 Welcome aboard, ${user.name}!`,
        });
      }
    
      return true;
    },    

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
        token.image = user.avatarUrl!;
      }

      if (trigger === "update" || token.email) {
        await dbConnection();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {

          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.avatarUrl;
          token.username = dbUser.username;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.avatarUrl = token.image as string;
        session.user.username = token.username as string; 
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
