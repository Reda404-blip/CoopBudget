"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIStats } from "@/components/exercices/ai-stats"
import { Brain, Database, Settings, Users } from "lucide-react"

export default function AIAdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("stats")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord IA</h1>
          <p className="text-gray-500">Gérez et surveillez les performances de l'IA pour les exercices budgétaires</p>
        </div>

        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Paramètres de l'IA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Analyses IA</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Exercices analysés</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-gray-500">Taux de précision</p>
                <p className="text-2xl font-bold">94.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="models">Modèles IA</TabsTrigger>
          <TabsTrigger value="feedback">Retours utilisateurs</TabsTrigger>
          <TabsTrigger value="logs">Journaux d'activité</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-0">
          <AIStats />
        </TabsContent>

        <TabsContent value="models" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Modèles d'IA disponibles</CardTitle>
              <CardDescription>Configurez les modèles d'IA utilisés pour l'analyse des exercices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Brain className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">GPT-4o</p>
                      <p className="text-sm text-gray-500">Modèle principal pour l'analyse détaillée</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mr-2">
                      Actif
                    </span>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Brain className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="font-medium">GPT-3.5 Turbo</p>
                      <p className="text-sm text-gray-500">Modèle rapide pour les analyses simples</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium mr-2">
                      Inactif
                    </span>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Brain className="h-8 w-8 text-amber-500" />
                    <div>
                      <p className="font-medium">Modèle spécialisé</p>
                      <p className="text-sm text-gray-500">Modèle entraîné sur des données financières</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mr-2">
                      En test
                    </span>
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Retours des utilisateurs</CardTitle>
              <CardDescription>Évaluations et commentaires sur les analyses de l'IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: "Jean D.",
                    exercise: "Analyse d'écarts",
                    rating: 5,
                    comment: "Analyse très précise et détaillée.",
                  },
                  {
                    user: "Marie L.",
                    exercise: "Optimisation de prix",
                    rating: 4,
                    comment: "Bonnes recommandations, mais quelques explications manquent de clarté.",
                  },
                  {
                    user: "Thomas B.",
                    exercise: "Budget prévisionnel",
                    rating: 5,
                    comment: "Exactement ce dont j'avais besoin pour comprendre l'exercice.",
                  },
                ].map((feedback, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{feedback.user}</p>
                        <p className="text-sm text-gray-500">{feedback.exercise}</p>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Journaux d'activité</CardTitle>
              <CardDescription>Historique des analyses effectuées par l'IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exercice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modèle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durée
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        date: "2023-04-14 14:32",
                        user: "Jean D.",
                        exercise: "Atlas Produit A",
                        model: "GPT-4o",
                        duration: "3.2s",
                        status: "success",
                      },
                      {
                        date: "2023-04-14 11:15",
                        user: "Marie L.",
                        exercise: "Britools Prix",
                        model: "GPT-4o",
                        duration: "2.8s",
                        status: "success",
                      },
                      {
                        date: "2023-04-13 16:47",
                        user: "Thomas B.",
                        exercise: "Ecopack Budget",
                        model: "GPT-4o",
                        duration: "3.5s",
                        status: "success",
                      },
                      {
                        date: "2023-04-13 10:22",
                        user: "Sophie M.",
                        exercise: "Atlas Produit A",
                        model: "GPT-4o",
                        duration: "4.1s",
                        status: "error",
                      },
                    ].map((log, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{log.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.exercise}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.model}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.status === "success" ? "Réussi" : "Échec"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
