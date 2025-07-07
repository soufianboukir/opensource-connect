"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectTech } from "./select-tech";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/services/user";
import { useSession } from "next-auth/react";


export function EditProfile() {
    const [openToWork, setOpenToWork] = useState(true);
    const [experienceLevel, setExperienceLevel] = useState<"junior" | "mid" | "senior" | "lead">("mid");
    const [techStack, setTechStack] = useState<string[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoading,setIsLoading] = useState(false);
    const { data:session,update } = useSession()

    const handleTechAdd = (tech: string) => {
        if (!techStack.includes(tech)) {
            setTechStack([...techStack, tech]);
        }
    };

    const handleTechDelete = (techToDelete:string) =>{
        const newTechs = techStack.filter((tech: string) => tech !== techToDelete)
        setTechStack(newTechs)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            username: formData.get("username"),
            bio: formData.get("bio"),
            headLine: formData.get("headLine"),
            githubUrl: formData.get("githubUrl"),
            websiteUrl: formData.get("websiteUrl"),
            openToWork,
            experienceLevel,
            techStack,
            avatar: avatarFile,
        };

        try{
            const response = await updateProfile(data)
            console.log(response);
            if(response.status === 200){
                toast.success("Profile data updated successfully")
                await update()
            }
            
        }catch{
            toast.error('Failed to update profile data')
        }finally{
            setIsLoading(false)
        }
    };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 py-2 text-sm font-medium dark:bg-blue-400 dark:hover:bg-blue-500 bg-blue-600 hover:bg-blue-700">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue="Soufian Boukir" className="mt-2"/>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue="soufian" className="mt-2"/>
              </div>
              <div>
                <Label htmlFor="headLine">Headline</Label>
                <Input id="headLine" name="headLine" defaultValue="MERN & Next.js Developer" className="mt-2"/>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={3} defaultValue="Building scalable platforms" className="mt-2"/>
              </div>
              <div>
                <Label htmlFor="avatar">Avatar Image</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="mt-2"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="githubUrl">GitHub/Gitlab URL</Label>
                <Input id="githubUrl" name="githubUrl" defaultValue="https://github.com/soufianboukir" className="mt-2"/>
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input id="websiteUrl" name="websiteUrl" defaultValue="https://soufianboukir.com" className="mt-2"/>
              </div>

              <div>
                <Label className="mb-2 block">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={(val) => setExperienceLevel(val as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="openToWork">Are you Open to Work?</Label>
                <Switch
                  id="openToWork"
                  checked={openToWork}
                  onCheckedChange={setOpenToWork}
                />
              </div>

              <div>
                <Label className="mb-1 block">Tech Stack</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                    <SelectTech onTechAdd={handleTechAdd}/>
                    {techStack && techStack.length > 0 && techStack.map((tech) => (
                        <div
                            key={tech}
                            className="group relative flex items-center bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all hover:bg-blue-700 shadow-sm hover:shadow-md"
                        >
                            {tech}
                            <button
                                onClick={() => handleTechDelete(tech)}
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md hover:shadow-lg cursor-pointer"
                                aria-label={`Delete ${tech}`}
                                type="button"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700">
                {
                    isLoading ? 
                        "Saving..."
                    :   "Save changes"
                }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
