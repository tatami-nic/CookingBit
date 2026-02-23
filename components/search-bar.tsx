"use client"

import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  sortBy: string
  sortOrder: string
  onSortChange: (sortBy: string, sortOrder: string) => void
}

const sortOptions = [
  { label: "Neueste zuerst", sortBy: "created_at", sortOrder: "desc" },
  { label: "Aelteste zuerst", sortBy: "created_at", sortOrder: "asc" },
  { label: "Name A-Z", sortBy: "name", sortOrder: "asc" },
  { label: "Name Z-A", sortBy: "name", sortOrder: "desc" },
  { label: "Schwierigkeit (niedrig)", sortBy: "difficulty", sortOrder: "asc" },
  { label: "Schwierigkeit (hoch)", sortBy: "difficulty", sortOrder: "desc" },
  { label: "Deliciousness (niedrig)", sortBy: "deliciousness", sortOrder: "asc" },
  { label: "Deliciousness (hoch)", sortBy: "deliciousness", sortOrder: "desc" },
]

export function SearchBar({
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}: SearchBarProps) {
  const currentSort = sortOptions.find(
    (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder
  )

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rezepte durchsuchen..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0" aria-label="Sortieren">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={`${option.sortBy}-${option.sortOrder}`}
              onClick={() => onSortChange(option.sortBy, option.sortOrder)}
              className={
                currentSort?.sortBy === option.sortBy && currentSort?.sortOrder === option.sortOrder
                  ? "bg-accent"
                  : ""
              }
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
