import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [recipe] = await sql`
    SELECT r.*, 
      COALESCE(ROUND(AVG(rt.difficulty), 1), r.difficulty) as avg_difficulty,
      COALESCE(ROUND(AVG(rt.deliciousness), 1), r.deliciousness) as avg_deliciousness,
      COUNT(rt.id) as rating_count
    FROM recipes r
    LEFT JOIN ratings rt ON r.id = rt.recipe_id
    WHERE r.id = ${id}
    GROUP BY r.id
  `

  if (!recipe) {
    return NextResponse.json({ error: "Rezept nicht gefunden" }, { status: 404 })
  }

  const ingredients = await sql`
    SELECT * FROM ingredients WHERE recipe_id = ${id} ORDER BY id
  `

  const ratings = await sql`
    SELECT * FROM ratings WHERE recipe_id = ${id} ORDER BY created_at DESC
  `

  return NextResponse.json({ ...recipe, ingredients, ratings })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { name, description, difficulty, deliciousness, creator, ingredients } = body

  if (!name || !description || !difficulty || !deliciousness) {
    return NextResponse.json(
      { error: "Alle Pflichtfelder muessen ausgefuellt sein." },
      { status: 400 }
    )
  }

  const [recipe] = await sql`
    UPDATE recipes 
    SET name = ${name}, description = ${description}, difficulty = ${difficulty}, 
        deliciousness = ${deliciousness}, creator = ${creator || "Anonym"},
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `

  if (!recipe) {
    return NextResponse.json({ error: "Rezept nicht gefunden" }, { status: 404 })
  }

  // Replace all ingredients
  await sql`DELETE FROM ingredients WHERE recipe_id = ${id}`
  if (ingredients?.length) {
    for (const ingredient of ingredients) {
      await sql`
        INSERT INTO ingredients (recipe_id, name, amount)
        VALUES (${id}, ${ingredient.name}, ${ingredient.amount})
      `
    }
  }

  return NextResponse.json(recipe)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [recipe] = await sql`
    DELETE FROM recipes WHERE id = ${id} RETURNING *
  `

  if (!recipe) {
    return NextResponse.json({ error: "Rezept nicht gefunden" }, { status: 404 })
  }

  return NextResponse.json({ message: "Rezept geloescht" })
}
