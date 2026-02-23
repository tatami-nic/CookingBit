import { Header } from "@/components/header"
import { RecipeForm } from "@/components/recipe-form"

export default function NewRecipePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <RecipeForm />
      </main>
    </div>
  )
}
