import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { difficulty, deliciousness } = body

  if (!difficulty || !deliciousness) {
    return NextResponse.json(
      { error: "Schwierigkeit und Deliciousness sind Pflichtfelder." },
      { status: 400 }
    )
  }

  if (difficulty < 1 || difficulty > 10 || deliciousness < 1 || deliciousness > 10) {
    return NextResponse.json(
      { error: "Bewertungen muessen zwischen 1 und 10 liegen." },
      { status: 400 }
    )
  }

  // Check recipe exists
  const [recipe] = await sql`SELECT id FROM recipes WHERE id = ${id}`
  if (!recipe) {
    return NextResponse.json({ error: "Rezept nicht gefunden" }, { status: 404 })
  }

  const [rating] = await sql`
    INSERT INTO ratings (recipe_id, difficulty, deliciousness)
    VALUES (${id}, ${difficulty}, ${deliciousness})
    RETURNING *
  `

  // Update recipe averages
  const [avg] = await sql`
    SELECT ROUND(AVG(difficulty), 1) as avg_diff, ROUND(AVG(deliciousness), 1) as avg_del
    FROM ratings WHERE recipe_id = ${id}
  `

  await sql`
    UPDATE recipes 
    SET difficulty = ${avg.avg_diff}, deliciousness = ${avg.avg_del}, updated_at = NOW()
    WHERE id = ${id}
  `

  return NextResponse.json(rating, { status: 201 })
}
