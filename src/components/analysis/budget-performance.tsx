"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Badge } from "@/components/ui/badge"

const performanceData = [
  { name: "Budget des ventes", score: 85, status: "success" },
  { name: "Budget des approvisionnements", score: 72, status: "warning" },
  { name: "Budget de production", score: 90, status: "success" },
  { name: "Budget de trésorerie", score: 65, status: "warning" },
  { name: "Budget des investissements", score: 78, status: "success" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const radarData = [
  {
    subject: "Précision",
    "Budget des ventes": 80,
    "Budget de production": 90,
    "Budget des approvisionnements": 70,
    fullMark: 100,
  },
  {
    subject: "Réactivité",
    "Budget des ventes": 85,
    "Budget de production": 75,
    "Budget des approvisionnements": 80,
    fullMark: 100,
  },
  {
    subject: "Flexibilité",
    "Budget des ventes": 65,
    "Budget de production": 85,
    "Budget des approvisionnements": 75,
    fullMark: 100,
  },
  {
    subject: "Efficacité",
    "Budget des ventes": 90,
    "Budget de production": 95,
    "Budget des approvisionnements": 65,
    fullMark: 100,
  },
  {
    subject: "Conformité",
    "Budget des ventes": 75,
    "Budget de production": 85,
    "Budget des approvisionnements": 90,
    fullMark: 100,
  },
]

export function BudgetPerformance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Select defaultValue="q1-2024">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2024">T1 2024</SelectItem>
                <SelectItem value="q4-2023">T4 2023</SelectItem>
                <SelectItem value="q3-2023">T3 2023</SelectItem>
                <SelectItem value="2023">Année 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="detailed">Analyse détaillée</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Performance globale des budgets</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="score"
                      nameKey="name"
                      label={({ name, score }) => `${name}: ${score}%`}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Critères de performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Budget des ventes"
                      dataKey="Budget des ventes"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Budget de production"
                      dataKey="Budget de production"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Budget des approvisionnements"
                      dataKey="Budget des approvisionnements"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Résumé de la performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceData.map((budget, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{budget.name}</h4>
                      <Badge className={budget.status === "success" ? "bg-green-500" : "bg-yellow-500"}>
                        {budget.status === "success" ? "Bon" : "À améliorer"}
                      </Badge>
                    </div>
                    <div className="mt-4 text-3xl font-bold">{budget.score}%</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {budget.score >= 80
                        ? "Performance excellente"
                        : budget.score >= 70
                          ? "Performance satisfaisante"
                          : "Des améliorations sont nécessaires"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Analyse détaillée par budget</h3>

                <Tabs defaultValue="sales">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sales">Ventes</TabsTrigger>
                    <TabsTrigger value="production">Production</TabsTrigger>
                    <TabsTrigger value="procurement">Approvisionnements</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sales" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Points forts</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Prévisions de ventes précises à 92%</li>
                          <li>Réactivité aux changements du marché</li>
                          <li>Bonne allocation des ressources marketing</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Points à améliorer</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Flexibilité limitée face aux opportunités imprévues</li>
                          <li>Surestimation des ventes pour le Produit B</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommandations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Mettre en place un processus de révision mensuelle des prévisions</li>
                        <li>Améliorer la collecte de données sur les tendances du marché</li>
                        <li>Intégrer des scénarios alternatifs dans la planification</li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="production" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Points forts</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Excellente efficacité des processus de production</li>
                          <li>Bonne gestion des coûts de main d'œuvre</li>
                          <li>Optimisation des ressources</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Points à améliorer</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Réactivité aux changements de planning</li>
                          <li>Sous-estimation des coûts de maintenance</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommandations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Mettre en place un programme de maintenance préventive</li>
                        <li>Améliorer la flexibilité des lignes de production</li>
                        <li>Revoir les estimations des coûts indirects</li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="procurement" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Points forts</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Excellente conformité aux procédures d'achat</li>
                          <li>Bonne gestion des relations fournisseurs</li>
                          <li>Respect des délais de livraison</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Points à améliorer</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Efficacité des négociations de prix</li>
                          <li>Précision des prévisions de besoins</li>
                          <li>Gestion des stocks</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommandations</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Former l'équipe aux techniques de négociation</li>
                        <li>Améliorer la coordination avec la production</li>
                        <li>Mettre en place un système de gestion des stocks plus précis</li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
