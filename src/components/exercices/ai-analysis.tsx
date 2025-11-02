"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Calculator, ChevronDown, ChevronUp, Lightbulb, Sparkles } from "lucide-react"
import type { Exercice, ExerciceData } from "@/types/exercices"
import type { AIAnalysisResponse } from "@/lib/ai-service"
import { analyzeExerciseWithAI } from "@/lib/ai-service"

interface AIAnalysisProps {
  exercice: Exercice
  data: ExerciceData
}

export function AIAnalysis({ exercice, data }: AIAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({})

  const handleAnalyze = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await analyzeExerciseWithAI({
        exerciceType: exercice.type,
        exerciceTitle: exercice.title,
        exerciceDescription: exercice.description,
        data,
      })

      setAnalysis(result)

      // Initialiser tous les étapes comme fermées
      const initialExpandState: Record<number, boolean> = {}
      result.solution.steps.forEach((_, index) => {
        initialExpandState[index] = false
      })
      setExpandedSteps(initialExpandState)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'analyse par l'IA")
      console.error("Erreur d'analyse IA:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStep = (index: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Analyse par IA en cours...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-[100px] w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Erreur d'analyse</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleAnalyze} className="mt-4" variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse par Intelligence Artificielle</CardTitle>
          <CardDescription>
            Utilisez l'IA pour analyser cet exercice et obtenir une solution détaillée avec explications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <p className="text-lg font-medium mb-2">Résolution automatique par IA</p>
            <p className="text-sm text-gray-500 mb-6">
              Notre IA analysera les données de l'exercice et proposera une solution complète avec explications
              détaillées.
            </p>
            <Button onClick={handleAnalyze} className="bg-blue-600 hover:bg-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              Analyser avec l'IA
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Solution par Intelligence Artificielle
        </CardTitle>
        <CardDescription>Analyse complète de l'exercice avec explications détaillées</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="solution">
          <TabsList className="mb-4">
            <TabsTrigger value="solution">
              <Calculator className="h-4 w-4 mr-2" />
              Solution détaillée
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Lightbulb className="h-4 w-4 mr-2" />
              Recommandations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solution" className="space-y-6">
            {/* Résumé */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Résumé</h3>
              <p>{analysis.solution.summary}</p>
            </div>

            {/* Étapes de résolution */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Étapes de résolution</h3>

              {analysis.solution.steps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <div
                    className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleStep(index)}
                  >
                    <h4 className="font-medium">{step.title}</h4>
                    {expandedSteps[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>

                  {expandedSteps[index] && (
                    <CardContent className="pt-4">
                      <p className="mb-3">{step.description}</p>

                      {step.calculation && (
                        <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-3">{step.calculation}</div>
                      )}

                      {step.result && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Résultat:</span>
                          <span className="text-blue-600 font-medium">{step.result}</span>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Conclusion */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Conclusion</h3>
              <p>{analysis.solution.conclusion}</p>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="bg-amber-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-lg mb-4">Recommandations</h3>

              <ul className="space-y-3">
                {analysis.solution.recommendations.map((rec, index) => (
                  <li key={index} className="flex">
                    <Lightbulb className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant="outline" onClick={() => window.print()} className="w-full">
              Imprimer les recommandations
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
