import { Header } from "@/components/header"
import { RecipeDetail } from "@/components/recipe-detail"

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id === "neu") {
    // This will be handled by the /rezept/neu route
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <RecipeDetail id={id} />
      </main>
    </div>
  )
}
