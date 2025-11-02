"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Calculator, Check, X } from "lucide-react"
import type { Exercice, ExerciceData } from "@/types/exercices"
import type { AIAnalysisResponse } from "@/lib/ai-service"

interface ComparisonViewProps {
  exercice: Exercice
  data: ExerciceData
  manualAnalysis: React.ReactNode
  aiAnalysis: AIAnalysisResponse
}

export function ComparisonView({ exercice, data, manualAnalysis, aiAnalysis }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<string>("side-by-side")

  // Extraire les valeurs clés pour la comparaison
  const getKeyMetrics = () => {
    // Cette fonction extrairait les métriques clés des deux analyses pour les comparer
    // Pour l'exemple, nous utilisons des données fictives

    const metrics = [
      {
        name: "Écart global",
        manual: "12 500 €",
        ai: "12 450 €",
        match: true,
      },
      {
        name: "Écart sur prix",
        manual: "8 200 €",
        ai: "8 200 €",
        match: true,
      },
      {
        name: "Écart sur quantité",
        manual: "4 300 €",
        ai: "4 250 €",
        match: false,
      },
      {
        name: "Taux de variation",
        manual: "5,2%",
        ai: "5,2%",
        match: true,
      },
    ]

    return metrics
  }

  const metrics = getKeyMetrics()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparaison des analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="side-by-side">Côte à côte</TabsTrigger>
              <TabsTrigger value="metrics">Métriques clés</TabsTrigger>
            </TabsList>

            <TabsContent value="side-by-side" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Analyse manuelle
                  </h3>
                  <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">{manualAnalysis}</div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Analyse par IA
                  </h3>
                  <div className="border rounded-lg p-4 h-[500px] overflow-y-auto">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="font-medium mb-1">Résumé</h4>
                        <p>{aiAnalysis.solution.summary}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Étapes clés</h4>
                        {aiAnalysis.solution.steps.map((step, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded-md">
                            <p className="text-sm">{step.title}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-green-50 p-3 rounded-md">
                        <h4 className="font-medium mb-1">Conclusion</h4>
                        <p>{aiAnalysis.solution.conclusion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="mt-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Métrique
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Analyse manuelle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Analyse IA
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Correspondance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.map((metric, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{metric.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{metric.manual}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{metric.ai}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {metric.match ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Analyse de précision</h4>
                <p>
                  L'IA a correctement identifié {metrics.filter((m) => m.match).length} métriques sur {metrics.length},
                  soit une précision de {((metrics.filter((m) => m.match).length / metrics.length) * 100).toFixed(1)}%.
                </p>
                <p className="mt-2">
                  Les différences mineures peuvent être dues à des arrondis ou à des méthodes de calcul légèrement
                  différentes.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
