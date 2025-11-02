"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

export function AIStats() {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    exerciseTypes: { ecart: 0, optimisation: 0, budget: 0 },
    accuracyRate: 0,
    weeklyUsage: [0, 0, 0, 0],
  })

  useEffect(() => {
    // Dans une application réelle, ces données viendraient d'une API
    // Pour l'exemple, nous utilisons des données fictives
    setStats({
      totalAnalyses: 127,
      exerciseTypes: { ecart: 68, optimisation: 42, budget: 17 },
      accuracyRate: 94.5,
      weeklyUsage: [23, 35, 29, 40],
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques d'utilisation de l'IA</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <PieChart className="h-4 w-4 mr-2" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="usage">
              <LineChart className="h-4 w-4 mr-2" />
              Utilisation
            </TabsTrigger>
            <TabsTrigger value="accuracy">
              <BarChart className="h-4 w-4 mr-2" />
              Précision
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Analyses totales</p>
                    <p className="text-3xl font-bold">{stats.totalAnalyses}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Type le plus analysé</p>
                    <p className="text-3xl font-bold">Écarts</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((stats.exerciseTypes.ecart / stats.totalAnalyses) * 100)}% des analyses
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Taux de précision</p>
                    <p className="text-3xl font-bold">{stats.accuracyRate}%</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Répartition par type d'exercice</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">[Graphique de répartition]</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Utilisation hebdomadaire</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">[Graphique d'utilisation]</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Heures de pointe</h3>
                <div className="grid grid-cols-4 gap-4">
                  {["Matin", "Midi", "Après-midi", "Soir"].map((time, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">{time}</p>
                          <p className="text-2xl font-bold">{Math.round(stats.totalAnalyses * (0.1 + index * 0.15))}</p>
                          <p className="text-sm text-gray-500">analyses</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accuracy" className="mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Précision par type d'exercice</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">[Graphique de précision]</div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Amélioration continue</h4>
                <p>
                  Notre IA s'améliore constamment grâce à vos retours. Le taux de précision est passé de 89% à 94.5% au
                  cours des trois derniers mois.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
