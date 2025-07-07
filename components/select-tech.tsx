"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { techs } from "@/constants"
import { capitalizeFirst } from "@/functions"

type TechStackComboboxProps = {
    onTechAdd: (tech: string) => void;
  };
export function SelectTech({ onTechAdd }: TechStackComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? capitalizeFirst(value) : "Select tech..."}
          <ChevronsUpDown className="opacity-50 h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search tech..." className="h-9" />
          <CommandList>
            <CommandEmpty>No tech found.</CommandEmpty>
            <CommandGroup>
              {techs.map((tech,index) => (
                <CommandItem
                        key={index}
                        value={tech}
                        onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        onTechAdd(currentValue);
                    }}
                >
                  {capitalizeFirst(tech)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === tech ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
