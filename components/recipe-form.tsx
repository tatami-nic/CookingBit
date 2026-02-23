"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Ingredient {
  name: string
  amount: string
}

interface RecipeFormProps {
  recipeId?: string
}

export function RecipeForm({ recipeId }: RecipeFormProps) {
  const router = useRouter()
  const isEditing = !!recipeId

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [difficulty, setDifficulty] = useState(5)
  const [deliciousness, setDeliciousness] = useState(5)
  const [creator, setCreator] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEditing)

  useEffect(() => {
    if (isEditing) {
      fetch(`/api/recipes/${recipeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setName(data.name)
            setDescription(data.description)
            setDifficulty(data.difficulty)
            setDeliciousness(data.deliciousness)
            setCreator(data.creator || "")
            setIngredients(
              data.ingredients?.length
                ? data.ingredients.map((i: Ingredient) => ({ name: i.name, amount: i.amount }))
                : [{ name: "", amount: "" }]
            )
          }
          setIsFetching(false)
        })
        .catch(() => {
          toast.error("Fehler beim Laden des Rezepts")
          setIsFetching(false)
        })
    }
  }, [isEditing, recipeId])

  function addIngredient() {
    setIngredients([...ingredients, { name: "", amount: "" }])
  }

  function removeIngredient(index: number) {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    const updated = [...ingredients]
    updated[index][field] = value
    setIngredients(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const filledIngredients = ingredients.filter((i) => i.name.trim() && i.amount.trim())

    if (!name.trim() || !description.trim() || filledIngredients.length === 0) {
      toast.error("Bitte fulle alle Pflichtfelder aus und fuge mindestens eine Zutat hinzu.")
      return
    }

    setIsLoading(true)

    try {
      const url = isEditing ? `/api/recipes/${recipeId}` : "/api/recipes"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          difficulty,
          deliciousness,
          creator: creator.trim() || "Anonym",
          ingredients: filledIngredients,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Fehler beim Speichern")
      }

      const data = await res.json()
      toast.success(isEditing ? "Rezept aktualisiert!" : "Rezept erstellt!")
      router.push(`/rezept/${data.id || recipeId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Speichern")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Rezept wird geladen...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href={isEditing ? `/rezept/${recipeId}` : "/"}>
          <Button variant="ghost" size="sm" type="button" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Zurueck
          </Button>
        </Link>
      </div>

      <h1 className="font-serif text-3xl text-foreground text-balance">
        {isEditing ? "Rezept bearbeiten" : "Neues Rezept"}
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Grundlagen</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Rezeptname *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Wiener Schnitzel"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Beschreibung *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibe dein Rezept..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="creator">Ersteller</Label>
                <Input
                  id="creator"
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                  placeholder="Dein Name (optional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-lg">Zutaten</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" /> Zutat
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex flex-1 flex-col gap-1.5">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">Zutat</Label>
                    )}
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, "name", e.target.value)}
                      placeholder="z.B. Mehl"
                    />
                  </div>
                  <div className="flex w-32 flex-col gap-1.5">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">Menge</Label>
                    )}
                    <Input
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                      placeholder="z.B. 200g"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length <= 1}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Zutat entfernen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Ratings */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Bewertung</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Schwierigkeit</Label>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-sm font-medium text-secondary-foreground">
                    {difficulty}/10
                  </span>
                </div>
                <Slider
                  value={[difficulty]}
                  onValueChange={(v) => setDifficulty(v[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Deliciousness</Label>
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-sm font-medium text-secondary-foreground">
                    {deliciousness}/10
                  </span>
                </div>
                <Slider
                  value={[deliciousness]}
                  onValueChange={(v) => setDeliciousness(v[0])}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={isLoading} className="gap-2" size="lg">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? "Rezept aktualisieren" : "Rezept erstellen"}
          </Button>
        </div>
      </div>
    </form>
  )
}
