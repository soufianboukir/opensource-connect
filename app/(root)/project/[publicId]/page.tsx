import { dbConnection } from '@/config/db';
import Project from '@/models/project.model';
import { notFound } from 'next/navigation';
import { Project as ProjectInterface } from '@/interfaces';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/ui/site-header';
import { ProjectFilters } from '@/components/project-filters';
import { Metadata } from 'next';
import { ProjectActions } from '@/components/apply-save-status';
interface ProjectPageProps {
  params: { publicId: string };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  await dbConnection();
  await import('@/models/user.model');
  const project: ProjectInterface | null = await Project.findOne({ publicId: params.publicId })
                      .populate('owner', 'username name avatarUrl headLine')
                      .lean();

  if (!project) {
    return {
      title: "Project Not Found",
      description: "No project found.",
    };
  }

  return {
    title: `Project by ${project.owner?.name}`,
    description: `Explore project details by ${project.owner?.name}`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  await dbConnection();
  await import('@/models/user.model');
  const project: ProjectInterface | null = await Project.findOne({ publicId: params.publicId })
                      .populate('owner', 'username name avatarUrl headLine')
                      .lean();

  if (!project) return notFound();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader title="Discovery" />
          <div className="flex flex-col-reverse md:flex-row p-4 gap-4">
            <div className="max-w-4xl mx-auto p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Avatar className="w-[35px] h-[35px]">
                      <AvatarImage src={project?.owner?.avatarUrl} />
                      <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                <div>
                    <Link
                      href={`/user/${project.owner?.username}`}
                      className="font-medium hover:underline"
                    >
                      {project.owner?.name}
                    </Link>
                    <p className="font-semibold text-sm text-gray-400">{project.owner?.headLine || "@"+project.owner?.username}</p>
                  </div>
              </div>
              <ProjectActions projectData={project}/>
            </div>

            <h1 className="text-3xl font-bold mt-6">{project.title}</h1>

            {project.githubUrl && (
              <p className="mt-2 text-sm">
                GitHub:{" "}
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {project.githubUrl.replace(/^https?:\/\//, '')}
                </a>
              </p>
            )}
            {project.websiteUrl && (
              <p className="mt-2 text-sm">
                Website:{" "}
                <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                  {project.websiteUrl.replace(/^https?:\/\//, '')}
                </a>
              </p>
            )}

            <div className="mt-6 text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {project.description}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStackNeeded.map((tech: string) => (
                  <span key={tech} className="px-3 py-1 text-xs rounded-full border bg-blue-50 dark:bg-muted/40">
                    <Icon icon={`devicon:${tech.toLowerCase()}`} className="inline w-4 h-4 mr-1" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {
              project.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, idx: number) => (
                      <span key={idx} className="text-xs text-muted-foreground">#{tag}</span>
                    ))}
                  </div>
                </div>
              )
            }

            {
              project.rolesNeeded.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Roles Needed</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {project.rolesNeeded.map((role: { role: string; count: number }, idx: number) => (
                      <li key={idx}>{role.role}: {role.count}</li>
                    ))}
                  </ul>
                </div>
              )
            }

            <p className="mt-6 text-sm text-muted-foreground">
              Posted on {new Date(project?.createdAt).toLocaleDateString()}
            </p>
          </div>
            <ProjectFilters />
          </div>
      </SidebarInset>
    </SidebarProvider>
    
  );
}
