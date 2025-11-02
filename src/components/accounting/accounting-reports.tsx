"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Download } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

const chargesByProduct = [
  { name: "Produit A", value: 28500 },
  { name: "Produit B", value: 19200 },
  { name: "Produit C", value: 15800 },
]

const produitsByProduct = [
  { name: "Produit A", value: 32000 },
  { name: "Produit B", value: 24500 },
  { name: "Produit C", value: 18700 },
]

const chargesByCategory = [
  { name: "Achats", value: 32000 },
  { name: "Personnel", value: 45000 },
  { name: "Services extérieurs", value: 12500 },
  { name: "Impôts et taxes", value: 8000 },
  { name: "Charges financières", value: 3500 },
  { name: "Amortissements", value: 9800 },
]

const produitsByCategory = [
  { name: "Ventes de produits", value: 58000 },
  { name: "Prestations de services", value: 32000 },
  { name: "Produits financiers", value: 1200 },
  { name: "Subventions", value: 5000 },
]

const monthlyData = [
  { name: "Jan", charges: 18500, produits: 22000 },
  { name: "Fév", charges: 19200, produits: 21500 },
  { name: "Mar", charges: 20500, produits: 23800 },
  { name: "Avr", charges: 18900, produits: 22300 },
  { name: "Mai", charges: 19800, produits: 24100 },
  { name: "Juin", charges: 21200, produits: 25600 },
]

export function AccountingReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("q1-2024")
  const [selectedAxis, setSelectedAxis] = useState("product")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1-2024">T1 2024</SelectItem>
              <SelectItem value="q4-2023">T4 2023</SelectItem>
              <SelectItem value="2023">Année 2023</SelectItem>
              <SelectItem value="2024">Année 2024</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAxis} onValueChange={setSelectedAxis}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Axe analytique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Par produit</SelectItem>
              <SelectItem value="department">Par département</SelectItem>
              <SelectItem value="project">Par projet</SelectItem>
              <SelectItem value="activity">Par activité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Exporter les rapports
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="produits">Produits</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Évolution mensuelle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                    <Bar name="Charges" dataKey="charges" fill="#FF8042" />
                    <Bar name="Produits" dataKey="produits" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Résultat par produit</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Produit A", value: produitsByProduct[0].value - chargesByProduct[0].value },
                      { name: "Produit B", value: produitsByProduct[1].value - chargesByProduct[1].value },
                      { name: "Produit C", value: produitsByProduct[2].value - chargesByProduct[2].value },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Bar name="Résultat" dataKey="value" fill="#82ca9d">
                      {[
                        { name: "Produit A", value: produitsByProduct[0].value - chargesByProduct[0].value },
                        { name: "Produit B", value: produitsByProduct[1].value - chargesByProduct[1].value },
                        { name: "Produit C", value: produitsByProduct[2].value - chargesByProduct[2].value },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "#82ca9d" : "#ff8042"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Synthèse analytique</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Total des charges</div>
                  <div className="text-2xl font-bold">
                    {chargesByProduct.reduce((sum, item) => sum + item.value, 0).toLocaleString()} €
                  </div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Total des produits</div>
                  <div className="text-2xl font-bold">
                    {produitsByProduct.reduce((sum, item) => sum + item.value, 0).toLocaleString()} €
                  </div>
                </div>
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Résultat</div>
                  <div
                    className={`text-2xl font-bold ${
                      produitsByProduct.reduce((sum, item) => sum + item.value, 0) -
                        chargesByProduct.reduce((sum, item) => sum + item.value, 0) >=
                      0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(
                      produitsByProduct.reduce((sum, item) => sum + item.value, 0) -
                      chargesByProduct.reduce((sum, item) => sum + item.value, 0)
                    ).toLocaleString()}{" "}
                    €
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charges" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Répartition des charges par produit</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chargesByProduct}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chargesByProduct.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Répartition des charges par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chargesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chargesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Détail des charges par produit</h3>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant (€)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pourcentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chargesByProduct.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {((item.value / chargesByProduct.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(
                            1,
                          )}
                          %
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {chargesByProduct.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produits" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Répartition des produits par produit</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={produitsByProduct}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {produitsByProduct.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Répartition des produits par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={produitsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {produitsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Détail des produits par produit</h3>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant (€)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pourcentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produitsByProduct.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          {((item.value / produitsByProduct.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(
                            1,
                          )}
                          %
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {produitsByProduct.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">100%</td>
                    </tr>
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
