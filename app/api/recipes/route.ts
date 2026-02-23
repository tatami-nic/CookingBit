import { sql } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const sortBy = searchParams.get("sortBy") || "created_at"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const validSortColumns = ["name", "difficulty", "deliciousness", "created_at"]
  const safeSort = validSortColumns.includes(sortBy) ? sortBy : "created_at"
  const safeOrder = sortOrder === "asc" ? "ASC" : "DESC"

  let recipes
  if (search) {
    recipes = await sql`
      SELECT r.*, 
        COALESCE(ROUND(AVG(rt.difficulty), 1), r.difficulty) as avg_difficulty,
        COALESCE(ROUND(AVG(rt.deliciousness), 1), r.deliciousness) as avg_deliciousness,
        COUNT(rt.id) as rating_count
      FROM recipes r
      LEFT JOIN ratings rt ON r.id = rt.recipe_id
      WHERE r.name ILIKE ${"%" + search + "%"} 
        OR r.description ILIKE ${"%" + search + "%"}
        OR r.creator ILIKE ${"%" + search + "%"}
        OR EXISTS (
          SELECT 1 FROM ingredients i 
          WHERE i.recipe_id = r.id AND i.name ILIKE ${"%" + search + "%"}
        )
      GROUP BY r.id
      ORDER BY ${safeSort === "name" ? sql`r.name` : safeSort === "difficulty" ? sql`avg_difficulty` : safeSort === "deliciousness" ? sql`avg_deliciousness` : sql`r.created_at`} ${safeOrder === "ASC" ? sql`ASC` : sql`DESC`}
    `
  } else {
    recipes = await sql`
      SELECT r.*, 
        COALESCE(ROUND(AVG(rt.difficulty), 1), r.difficulty) as avg_difficulty,
        COALESCE(ROUND(AVG(rt.deliciousness), 1), r.deliciousness) as avg_deliciousness,
        COUNT(rt.id) as rating_count
      FROM recipes r
      LEFT JOIN ratings rt ON r.id = rt.recipe_id
      GROUP BY r.id
      ORDER BY ${safeSort === "name" ? sql`r.name` : safeSort === "difficulty" ? sql`avg_difficulty` : safeSort === "deliciousness" ? sql`avg_deliciousness` : sql`r.created_at`} ${safeOrder === "ASC" ? sql`ASC` : sql`DESC`}
    `
  }

  return NextResponse.json(recipes)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, description, difficulty, deliciousness, creator, ingredients } = body

  if (!name || !description || !difficulty || !deliciousness || !ingredients?.length) {
    return NextResponse.json(
      { error: "Alle Pflichtfelder muessen ausgefuellt sein." },
      { status: 400 }
    )
  }

  if (difficulty < 1 || difficulty > 10 || deliciousness < 1 || deliciousness > 10) {
    return NextResponse.json(
      { error: "Bewertungen muessen zwischen 1 und 10 liegen." },
      { status: 400 }
    )
  }

  const [recipe] = await sql`
    INSERT INTO recipes (name, description, difficulty, deliciousness, creator)
    VALUES (${name}, ${description}, ${difficulty}, ${deliciousness}, ${creator || "Anonym"})
    RETURNING *
  `

  for (const ingredient of ingredients) {
    await sql`
      INSERT INTO ingredients (recipe_id, name, amount)
      VALUES (${recipe.id}, ${ingredient.name}, ${ingredient.amount})
    `
  }

  return NextResponse.json(recipe, { status: 201 })
}
