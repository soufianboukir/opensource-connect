import { FolderX } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
    message?: string;
    description?: string;
    action?: ReactNode
}

export function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto max-w-md px-4 text-center">
            <div className="rounded-full dark:bg-muted/70 bg-gray-200 p-4 mb-6 inline-flex">
            <FolderX className="w-10 h-10 text-black dark:text-gray-300"/>
            </div>
            
            <h3 className="text-xl font-semibold tracking-tight mb-2">
                {message}
            </h3>
            
            <p className="text-muted-foreground mb-6">
                {description}
            </p>

            <div className="flex justify-center">
                {
                    action ? (
                        action
                    ) : null
                }
            </div>
        </div>
    </div>
  );
}