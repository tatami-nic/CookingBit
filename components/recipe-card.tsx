import Link from "next/link"
import { Clock, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RatingDisplay } from "@/components/rating-display"

interface Recipe {
  id: number
  name: string
  description: string
  difficulty: number
  deliciousness: number
  creator: string
  avg_difficulty: number
  avg_deliciousness: number
  rating_count: string
  created_at: string
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const date = new Date(recipe.created_at)
  const formattedDate = date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return (
    <Link href={`/rezept/${recipe.id}`}>
      <Card className="group h-full border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-lg text-card-foreground transition-colors group-hover:text-primary text-balance">
              {recipe.name}
            </h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <RatingDisplay
              value={Number(recipe.avg_difficulty)}
              label="Schwierigkeit"
              size="sm"
            />
            <RatingDisplay
              value={Number(recipe.avg_deliciousness)}
              label="Deliciousness"
              size="sm"
            />

            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {recipe.creator}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formattedDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
