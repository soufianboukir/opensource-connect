import { dbConnection } from '@/config/db';
import Project from '@/models/project.model';
import User from '@/models/user.model';
import { notFound } from 'next/navigation';
import { Project as ProjectInterface } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Activity, Archive, Clock, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProjectPageProps {
  params: { projectId: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  await dbConnection();

  const project: ProjectInterface = await Project.findOne({ publicId: params.projectId })
    .populate('owner', 'username name avatarUrl')
    .lean();

  if (!project) return notFound();

  const statusIndicator = {
    "in progress": <Clock className="w-4 h-4 text-yellow-500" />,
    "archived": <Archive className="w-4 h-4 text-gray-500" />,
    "active": <Activity className="w-4 h-4 text-green-500" />,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Avatar className="w-[35px] h-[35px]">
                <AvatarImage src={projectData?.owner?.avatarUrl} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          <div>
            <Link
              href={`/user/${project.owner?.username}`}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {project.owner?.name}
            </Link>
            <p className="text-sm text-muted-foreground">@{project.owner?.username}</p>
          </div>
        </div>
        <div>
          {statusIndicator[project.status]}
        </div>
      </div>

      <h1 className="text-3xl font-bold mt-6">{project.title}</h1>

      {project.githubUrl && (
        <p className="mt-2 text-sm">
          GitHub:{" "}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {project.githubUrl.replace(/^https?:\/\//, '')}
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

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string, idx: number) => (
            <span key={idx} className="text-xs text-muted-foreground">#{tag}</span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Roles Needed</h3>
        <ul className="list-disc list-inside text-muted-foreground">
          {project.rolesNeeded.map((role: { role: string; count: number }, idx: number) => (
            <li key={idx}>{role.role}: {role.count}</li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Posted on {new Date(project?.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
