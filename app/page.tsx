import { Header } from "@/components/header"
import { RecipeList } from "@/components/recipe-list"
import { ChefHat } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="font-serif text-3xl text-foreground text-balance md:text-4xl">
            Rezeptesammlung
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Entdecke, teile und bewerte die besten Rezepte aus aller Welt.
          </p>
        </div>
        <RecipeList />
      </main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ChefHat className="h-4 w-4" />
            <span>CookingBit</span>
          </div>
          <p className="text-xs text-muted-foreground">HTL Schulprojekt</p>
        </div>
      </footer>
    </div>
  )
}
