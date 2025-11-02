"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const costVarianceData = [
  {
    category: "Matières premières",
    standard: 12500,
    actual: 13200,
    variance: -700,
    variancePercent: -5.6,
  },
  {
    category: "Main d'œuvre",
    standard: 18000,
    actual: 17500,
    variance: 500,
    variancePercent: 2.8,
  },
  {
    category: "Emballage",
    standard: 4500,
    actual: 4650,
    variance: -150,
    variancePercent: -3.3,
  },
  {
    category: "Frais généraux",
    standard: 8000,
    actual: 7800,
    variance: 200,
    variancePercent: 2.5,
  },
  {
    category: "Logistique",
    standard: 6000,
    actual: 6300,
    variance: -300,
    variancePercent: -5.0,
  },
]

const costTrendData = [
  {
    month: "Jan",
    standard: 10000,
    actual: 10200,
  },
  {
    month: "Fév",
    standard: 10000,
    actual: 10500,
  },
  {
    month: "Mar",
    standard: 10000,
    actual: 10800,
  },
  {
    month: "Avr",
    standard: 10500,
    actual: 11000,
  },
  {
    month: "Mai",
    standard: 10500,
    actual: 10300,
  },
  {
    month: "Juin",
    standard: 10500,
    actual: 10400,
  },
]

export function CostAnalysis() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Analyse comparative des coûts</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Produit:</span>
          <Select defaultValue="prodA">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prodA">Produit A</SelectItem>
              <SelectItem value="prodB">Produit B</SelectItem>
              <SelectItem value="prodC">Produit C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="variance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="variance">Écarts de coûts</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Écarts entre coûts standards et réels</CardTitle>
              <CardDescription>Analyse des écarts par catégorie de coûts pour le Produit A</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={costVarianceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value}`} />
                  <Legend />
                  <Bar name="Coût standard" dataKey="standard" fill="#8884d8" />
                  <Bar name="Coût réel" dataKey="actual" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Standard (€)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réel (€)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Écart (€)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Écart (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {costVarianceData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.standard.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.actual.toLocaleString()}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${item.variance >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {item.variance >= 0 ? "+" : ""}
                          {item.variance.toLocaleString()}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${item.variancePercent >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {item.variancePercent >= 0 ? "+" : ""}
                          {item.variancePercent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendances des coûts sur 6 mois</CardTitle>
              <CardDescription>Évolution des coûts standards et réels pour le Produit A</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={costTrendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `€${value}`} />
                  <Legend />
                  <Line type="monotone" dataKey="standard" name="Coût standard" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="actual" name="Coût réel" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
