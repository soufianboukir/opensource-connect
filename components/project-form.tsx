"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, XIcon } from "lucide-react";
import { toast } from "sonner";
import { SelectTech } from "./select-tech";
import { addProject, updateProject } from "@/services/project";
import { Project } from "@/interfaces";

type ProjectFormProps = {
  projectData?: Project;
  open?: boolean
  onOpenChange?: (val: { open: boolean, projectData: Project }) => void
  onUpdate?: (projectData: Project) => void
  onAdded?: (projectData: Project) => void
}

export function ProjectForm({ projectData, open, onOpenChange, onUpdate, onAdded }: ProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Project>({
    title: projectData?.title || "",
    description: projectData?.description || "",
    githubUrl: projectData?.githubUrl || "",
    websiteUrl: projectData?.websiteUrl || "",
    status: projectData?.status || "active" as "active" | "archived" | "in progress",
    techStackNeeded: projectData?.techStackNeeded || [] as string[],
    rolesNeeded: projectData?.rolesNeeded || [] as { role: string; count: number }[],
    tags: projectData?.tags || [] as string[],
  });

  const [roleInput, setRoleInput] = useState("");
  const [roleCount, setRoleCount] = useState(1);
  const [tagInput, setTagInput] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechAdd = (tech: string) => {
    setFormData((prev) => {
      if (prev.techStackNeeded.includes(tech)) return prev;
      return { ...prev, techStackNeeded: [...prev.techStackNeeded, tech] };
    });
  };

  const handleTechDelete = (techToDelete: string) => {
    setFormData((prev) => ({
      ...prev,
      techStackNeeded: prev.techStackNeeded.filter((tech) => tech !== techToDelete),
    }));
  };

  const handleRoleAdd = () => {
    if (!roleInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      rolesNeeded: [...prev.rolesNeeded, { role: roleInput.trim(), count: roleCount }],
    }));
    setRoleInput("");
    setRoleCount(1);
  };

  const handleRoleDelete = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.rolesNeeded];
      updated.splice(index, 1);
      return { ...prev, rolesNeeded: updated };
    });
  };

  const handleTagAdd = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };

  const handleTagDelete = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.title === '' || formData.description === '' || formData.techStackNeeded.length === 0){
      toast.error('Please fill the inputs marked as required')
      return
    }
    setIsLoading(true);

    try {
      let response ;
      if(!open){
        response = await addProject(formData);
        if(response.status === 200){
          toast.success('New Project submitted successfully')
          onAdded?.(formData);
        }
      }
      if(open){
        response = await updateProject(formData,projectData?._id);
        if(response.status === 200){
          onOpenChange?.({open:false, projectData: {title:'',description:'',githubUrl:'',websiteUrl:'',status:'active',tags:[],rolesNeeded:[],techStackNeeded:[]} })
          onUpdate?.(response.data.updatedProject)
          toast.success('Project data updated successfully')
        }
      }
      
      
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange?.({ open: false, projectData: {title:'',description:'',githubUrl:'',websiteUrl:'',status:'active',tags:[],rolesNeeded:[],techStackNeeded:[]} })}>
      {!open && (
        <>
          <DialogTrigger asChild>
            <Button className="lg:flex hidden bg-blue-600 items-center gap-2 rounded-xl px-4 py-2 text-white font-semibold hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Submit a project
            </Button>
          </DialogTrigger>

          <DialogTrigger asChild>
            <Button className="lg:hidden bg-blue-600 flex items-center gap-2 rounded-xl px-4 py-2 text-white font-semibold hover:bg-blue-700">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </>
      )}



      <DialogContent className="sm:max-w-4xl overflow-auto max-h-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {
                !open ?
                  "Submit a new project"
                  : "Edit project data"
              }
            </DialogTitle>
            <DialogDescription>
              {
                !open ? 
                  "Share a project and find contributors."
                : "Update your project data"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div className="flex flex-col gap-4">
              <Label>Title *</Label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Are you available for this project?"/>

              <Label>Description *</Label>
              <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Long description about the project..." rows={4} />

              <Label>GitHub/Gitlab URL</Label>
              <Input name="githubUrl" value={formData.githubUrl} placeholder="https://github.com/your-repo" onChange={handleChange} />

              <Label>Website URL</Label>
              <Input name="websiteUrl" value={formData.websiteUrl} placeholder="https://yourproject.com" onChange={handleChange} />
            
              <Label>Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val as typeof formData.status }))}
              >
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4 w-[100%]">
              <Label>Tech Stack Needed *</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <SelectTech onTechAdd={handleTechAdd} />
                {formData.techStackNeeded.map((tech) => (
                  <div key={tech} className="group relative flex items-center bg-blue-600 dark:bg-muted/60 text-white px-3 py-1 rounded-lg text-sm">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleTechDelete(tech)}
                      className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <Label>Roles Needed</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Role (e.g., Frontend)"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                />
                <Input
                  type="number"
                  min={1}
                  value={roleCount}
                  onChange={(e) => setRoleCount(Number(e.target.value))}
                  className="w-20"
                />
                <Button type="button" onClick={handleRoleAdd}>Add</Button>
              </div>
              <ul className="space-y-1">
                {formData.rolesNeeded.map((role, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm bg-gray-100 dark:bg-muted/50 p-2 rounded">
                    {role.role} - {role.count} person(s)
                    <button onClick={() => handleRoleDelete(idx)} type="button" className="text-red-600 cursor-pointer">Remove</button>
                  </li>
                ))}
              </ul>

              <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input
                    placeholder="e.g., open source"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    />
                    <Button type="button" onClick={handleTagAdd}>Add</Button>
                </div>
                <div className=" mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                        <div key={tag} className="group relative flex items-center bg-gray-100 dark:bg-muted/50 text-sm px-3 py-1 rounded-full justify-center">
                            {tag}
                            <button
                            onClick={() => handleTagDelete(tag)}
                            type="button"
                            className="ml-2 text-red-600 hover:text-red-800"
                            >
                                <XIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
                {isLoading
                  ? projectData ? "Saving..." : "Submitting..."
                  : projectData ? "Save changes" : "Submit project"}
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
