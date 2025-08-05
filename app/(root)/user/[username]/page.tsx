import { Icon } from "@iconify/react";
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
import { Metadata } from "next";
import { ApplicationSubmission } from "@/components/application-submission";

interface UserProfileProps {
  params: {
    username: string;
  };
}


export async function generateMetadata({ params }: UserProfileProps): Promise<Metadata> {
  await dbConnection();
  const user: IUser | null = await User.findOne({ username: params.username }).lean();

  if (!user) {
    return {
      title: "User Not Found",
      description: "No user profile found for this username.",
    };
  }

  return {
    title: `${user.username} (${user.name})`,
    description: `Explore ${user.name}'s porfolio on our platform.`,
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
          <div className="relative mb-8">
            <div className="w-full h-32 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-800" />
            <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg object-cover">
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
              <span className="dark:bg-white font-semibold bg-black dark:text-black text-white px-3 rounded-xl">{user.experienceLevel}</span>
              <span
                className={`px-3 py-0.5 rounded-xl text-white text-sm font-medium ${
                  user.openToWork ? 'bg-green-600' : 'bg-gray-500'
                }`}
              >
                {user.openToWork ? 'Open to work' : 'Not available for work'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 text-sm text-gray-800 dark:text-gray-200">
              <div className="flex items-center gap-2 font-medium">
                <Cake className="w-5 h-5" />
                <span>
                  Joined on{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {user.websiteUrl && (
                <div className="flex items-center gap-2 font-medium">
                  <Earth className="w-5 h-5" />
                  <Link
                    href={user.websiteUrl}
                    className="hover:text-blue-600 truncate max-w-[200px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.websiteUrl}
                  </Link>
                </div>
              )}

              {user.githubUrl && (
                <div className="flex items-center gap-2 font-medium">
                  <Github className="w-5 h-5" />
                  <Link
                    href={user.githubUrl}
                    className="hover:text-blue-600 truncate max-w-[200px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.githubUrl}
                  </Link>
                </div>
              )}
            </div>



            {user.bio && (
              <p className="text-muted-foreground mt-6 max-w-xl mx-auto">
                {user?.bio || "I enjoy turning ideas into fast, simple, and useful experiences. Here you'll find fragments of my curiosity, experiments, and ambition — written in code, shaped by open source, and shared with intention. Available for open-source projects using Express.js, TypeScript, Next.js, or React — happy to collaborate!"}
              </p>
            )}

            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto">
                {user.techStack && user.techStack.length > 0 && user.techStack.map((tech: string, index: number) => (
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
                <EditProfile user={user}/>
              </div>
            )}
            {
              !isCurrentUser && (
                <div>
                    <br />
                    <ApplicationSubmission proposeCollaboration={true} toUser={user._id}/>
                </div>
              )
            }
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
