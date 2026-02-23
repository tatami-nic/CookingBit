"use client"

import { useRouter } from "next/navigation"
import useSWR from "swr"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Edit,
  Loader2,
  Trash2,
  User,
  UtensilsCrossed,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RatingDisplay } from "@/components/rating-display"
import { RatingForm } from "@/components/rating-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Ingredient {
  id: number
  name: string
  amount: string
}

export function RecipeDetail({ id }: { id: string }) {
  const router = useRouter()
  const { data: recipe, isLoading, mutate } = useSWR(`/api/recipes/${id}`, fetcher)

  async function handleDelete() {
    try {
      const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Fehler beim Loeschen")
      toast.success("Rezept geloescht!")
      router.push("/")
    } catch {
      toast.error("Fehler beim Loeschen des Rezepts")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Rezept wird geladen...</p>
      </div>
    )
  }

  if (!recipe || recipe.error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <UtensilsCrossed className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">Rezept nicht gefunden</p>
          <p className="text-sm text-muted-foreground">
            Dieses Rezept existiert nicht oder wurde geloescht.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Zurueck
          </Button>
        </Link>
      </div>
    )
  }

  const date = new Date(recipe.created_at)
  const formattedDate = date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Zurueck
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/rezept/${id}/bearbeiten`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-3.5 w-3.5" /> Bearbeiten
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="h-3.5 w-3.5" /> Loeschen
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rezept loeschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bist du sicher, dass du dieses Rezept loeschen moechtest? Diese Aktion kann nicht rueckgaengig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Loeschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Recipe header */}
      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-3xl text-foreground text-balance md:text-4xl">
          {recipe.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {recipe.creator}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {formattedDate}
          </span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
            {recipe.rating_count} Bewertung{recipe.rating_count !== "1" ? "en" : ""}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Beschreibung</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-card-foreground">{recipe.description}</p>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Zutaten</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {recipe.ingredients?.map((ing: Ingredient, i: number) => (
                  <li key={ing.id} className="flex items-center justify-between">
                    <span className="text-card-foreground">{ing.name}</span>
                    <span className="text-sm font-medium text-muted-foreground">{ing.amount}</span>
                    {i < recipe.ingredients.length - 1 && <Separator className="mt-2" />}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Ratings summary */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Bewertung</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <RatingDisplay value={Number(recipe.avg_difficulty)} label="Schwierigkeit" />
              <RatingDisplay value={Number(recipe.avg_deliciousness)} label="Deliciousness" />
            </CardContent>
          </Card>

          {/* Rating form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Bewerten</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingForm recipeId={Number(id)} onSuccess={() => mutate()} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
