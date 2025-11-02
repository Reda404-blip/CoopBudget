"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, BookOpen, BarChart, Calculator } from "lucide-react"
import { getExercices } from "@/lib/services/exercice-service"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateExerciceForm } from "@/components/exercices/create-exercice-form"
import type { Exercice } from "@/types/exercices"

export default function ExercicesExternes() {
  const router = useRouter()
  const [exercices, setExercices] = useState<Exercice[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("tous")

  useEffect(() => {
    const fetchExercices = async () => {
      try {
        const data = await getExercices()
        setExercices(data)
      } catch (error) {
        console.error("Erreur lors du chargement des exercices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercices()
  }, [])

  const filteredExercices = activeTab === "tous" ? exercices : exercices.filter((ex) => ex.type === activeTab)

  const handleExerciceClick = (id: string) => {
    router.push(`/exercices-externes/${id}`)
  }

  const getExerciceIcon = (type: string) => {
    switch (type) {
      case "ecart":
        return <BarChart className="h-5 w-5" />
      case "optimisation":
        return <Calculator className="h-5 w-5" />
      case "budget":
        return <BookOpen className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facile":
        return "bg-green-100 text-green-800"
      case "moyen":
        return "bg-yellow-100 text-yellow-800"
      case "difficile":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercices Externes</h1>
          <p className="text-muted-foreground">
            Pratiquez avec des exercices de gestion budgétaire issus de cas réels.
          </p>
        </div>
        <Button asChild>
          <Link href="/exercices-externes?new=true">
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer un exercice
          </Link>
        </Button>
      </div>

      {typeof window !== "undefined" && window.location.search.includes("new=true") ? (
        <CreateExerciceForm />
      ) : (
        <Tabs defaultValue="tous" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tous">Tous les exercices</TabsTrigger>
            <TabsTrigger value="ecart">Analyse d'écarts</TabsTrigger>
            <TabsTrigger value="optimisation">Optimisation de prix</TabsTrigger>
            <TabsTrigger value="budget">Budget prévisionnel</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredExercices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercices.map((exercice) => (
                  <Card
                    key={exercice.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleExerciceClick(exercice.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{exercice.title}</CardTitle>
                        <div className="flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-700">
                          {getExerciceIcon(exercice.type)}
                        </div>
                      </div>
                      <CardDescription>{exercice.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercice.difficulty)}`}
                        >
                          {exercice.difficulty.charAt(0).toUpperCase() + exercice.difficulty.slice(1)}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {exercice.type === "ecart"
                            ? "Analyse d'écarts"
                            : exercice.type === "optimisation"
                              ? "Optimisation de prix"
                              : "Budget prévisionnel"}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => handleExerciceClick(exercice.id)}>
                        Commencer l'exercice
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Aucun exercice trouvé</h3>
                <p className="text-muted-foreground mb-6">Il n'y a pas encore d'exercices dans cette catégorie.</p>
                <Button asChild>
                  <Link href="/exercices-externes?new=true">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Créer un exercice
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
