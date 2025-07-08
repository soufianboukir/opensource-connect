import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function ProjectFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [tech, setTech] = useState('');
    const [techStack, setTechStack] = useState<string[]>([]);
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState<string[]>([]);
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [sort, setSort] = useState('newest');

    const handleApply = () => {
        onFilterChange({ search, status, techStack, roles, tags, sort });
    };

    return (
        <div className="hidden md:block md:w-[25%] p-4 space-y-4 bg-transparent sticky top-20 h-fit">
            <div>
                <Label>Search</Label>
                <Input placeholder="Search by title or description" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Tech Stack</Label>
                <div className="flex gap-2">
                <Input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="e.g., React" />
                <Button type="button" onClick={() => {
                    if (tech && !techStack.includes(tech)) setTechStack([...techStack, tech]);
                    setTech('');
                }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {techStack.map(t => (
                    <div key={t} className="flex items-center gap-1 bg-muted/40 text-xs px-3 py-1 rounded-full">
                    {t}
                    <button onClick={() => setTechStack(techStack.filter(x => x !== t))}>
                        <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                    </div>
                ))}
                </div>
            </div>

            <div>
                <Label>Roles</Label>
                <div className="flex gap-2">
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Backend" />
                <Button type="button" onClick={() => {
                    if (role && !roles.includes(role)) setRoles([...roles, role]);
                    setRole('');
                }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {roles.map(r => (
                    <div key={r} className="flex items-center gap-1 bg-muted/40 text-xs px-3 py-1 rounded-full">
                    {r}
                    <button onClick={() => setRoles(roles.filter(x => x !== r))}>
                        <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                    </div>
                ))}
                </div>
            </div>

            <div>
                <Label>Tags</Label>
                <div className="flex gap-2">
                <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g., ai" />
                <Button type="button" onClick={() => {
                    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
                    setTag('');
                }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(t => (
                    <div key={t} className="flex items-center gap-1 bg-muted/40 text-xs px-3 py-1 rounded-full">
                    #{t}
                    <button onClick={() => setTags(tags.filter(x => x !== t))}>
                        <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                    </div>
                ))}
                </div>
            </div>

            <div>
                <Label>Sort By</Label>
                <Select value={sort} onValueChange={setSort}>
                <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <Button className="w-full mt-2 bg-blue-600 text-white dark:bg-blue-600 hover:bg-blue-700" onClick={handleApply}>
                Apply Filters
            </Button>
        </div>
    );
}
