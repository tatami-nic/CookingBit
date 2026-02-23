"use client"

import { useState } from "react"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

interface RatingFormProps {
  recipeId: number
  onSuccess: () => void
}

export function RatingForm({ recipeId, onSuccess }: RatingFormProps) {
  const [difficulty, setDifficulty] = useState(5)
  const [deliciousness, setDeliciousness] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/recipes/${recipeId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty, deliciousness }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Fehler beim Bewerten")
      }

      toast.success("Bewertung gespeichert!")
      setDifficulty(5)
      setDeliciousness(5)
      onSuccess()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Fehler beim Bewerten")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-foreground">Schwierigkeit</Label>
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
          <Label className="text-sm text-foreground">Deliciousness</Label>
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

      <Button type="submit" disabled={isSubmitting} className="gap-2">
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Star className="h-4 w-4" />
        )}
        Bewertung abgeben
      </Button>
    </form>
  )
}
