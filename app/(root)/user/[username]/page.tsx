import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { notFound } from "next/navigation";
import { dbConnection } from "@/config/db";
import User, { IUser } from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { capitalizeFirst } from "@/functions";
import { Cake, Earth, Github } from "lucide-react";
import Link from "next/link";
import { EditProfile } from "@/components/edit-profile";

interface UserProfileProps {
  params: {
    username: string;
  };
}

export default async function UserProfile({ params }: UserProfileProps) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user:IUser | null = await User.findOne({ username: params.username }).lean();

  if (!user) return notFound();

  const isCurrentUser = session?.user?.email === user.email;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title={`${user.name}'s Profile`} />

        <div className="p-6 md:p-6 w-[100%] mx-auto text-center">
          {/* Banner and Avatar */}
          <div className="relative mb-8">
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-800" />
            <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage
                  src={user.avatarUrl || ""}
                  alt={user.name || "User Avatar"}
                />
                <AvatarFallback className="text-xl font-semibold bg-muted text-muted-foreground">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-20">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {user.name || "No Name"} | {user.headLine || "Next.js Developer"}
            </h1>
            <p className="text-muted-foreground">
              @{user.username || "unknown"}
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="dark:bg-white bg-black dark:text-black text-white px-3 rounded-xl">Senior</span>
              <span className="bg-green-600 text-white px-3 py-0.5 rounded-xl">Open to work</span>
            </div>

            <div className="flex items-center justify-center gap-10 mt-6">
              <span className="flex items-center gap-2 font-semibold justify-center">
                <Cake  className="w-6 h-6"/> 
                <span>
                  Joined on {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
                </span>
              </span>
              <span className="flex items-center gap-2 font-semibold justify-center">
                {
                  // user.websiteUrl && (
                    <>
                      <Earth  className="w-6 h-6"/> 
                      <Link href={"https://soufianboukir.com"} className="hover:text-blue-500">
                        {user.websiteUrl || 'https://soufianboukir.com'}
                      </Link>
                    </>
                  // )
                }
              </span>

              <span className="flex items-center gap-2 font-semibold justify-center">
                {
                  // user.githubUrl && (
                    <>
                      <Github  className="w-6 h-6"/> 
                      <Link href={"https://github.com/soufianboukir"} className="hover:text-blue-500">
                        {user.githubUrl || 'https://github.com/soufianboukir'}
                      </Link>
                    </>
                  // )
                }
              </span>
            </div>


            {/* {user.bio && ( */}
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
                {user?.bio || "I enjoy turning ideas into fast, simple, and useful experiences. Here you'll find fragments of my curiosity, experiments, and ambition — written in code, shaped by open source, and shared with intention. Available for open-source projects using Express.js, TypeScript, Next.js, or React — happy to collaborate!"}
              </p>
            {/* )} */}

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
                {['nodejs','nextjs','python','nestjs','mysql','postgresql','javascript','typescript','csharp','cpp','aspnet','django','laravel','mern','linux'].map((tech: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground border border-border flex items-center gap-2"
                  >
                            <Icon icon={`devicon:${tech}`} className="w-6 h-6" />
                            {capitalizeFirst(tech)}
                  </span>
                )) || <p className="text-sm text-muted-foreground">Not specified</p>}
              </div>
            </div>

            {isCurrentUser && (
              <div className="mt-8">
                <EditProfile />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
