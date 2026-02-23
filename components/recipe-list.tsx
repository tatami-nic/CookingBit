"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2, UtensilsCrossed } from "lucide-react"
import { RecipeCard } from "@/components/recipe-card"
import { SearchBar } from "@/components/search-bar"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RecipeList() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { data: recipes, isLoading } = useSWR(
    `/api/recipes?search=${encodeURIComponent(debouncedSearch)}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
    fetcher
  )

  const handleSearchChange = (value: string) => {
    setSearch(value)
    // Simple debounce
    clearTimeout((globalThis as Record<string, ReturnType<typeof setTimeout>>).__searchTimeout)
    ;(globalThis as Record<string, ReturnType<typeof setTimeout>>).__searchTimeout = setTimeout(() => {
      setDebouncedSearch(value)
    }, 300)
  }

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchBar
        search={search}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Rezepte werden geladen...</p>
        </div>
      ) : recipes?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Keine Rezepte gefunden</p>
            <p className="text-sm text-muted-foreground">
              {search
                ? "Versuche einen anderen Suchbegriff."
                : "Fuege dein erstes Rezept hinzu!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes?.map((recipe: Record<string, unknown>) => (
            <RecipeCard key={recipe.id as number} recipe={recipe as never} />
          ))}
        </div>
      )}
    </div>
  )
}
