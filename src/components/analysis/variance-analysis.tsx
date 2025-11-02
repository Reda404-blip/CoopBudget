"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"

const budgetTypes = [
  { value: "sales", label: "Budget des ventes" },
  { value: "procurement", label: "Budget des approvisionnements" },
  { value: "production", label: "Budget de production" },
  { value: "treasury", label: "Budget de trésorerie" },
  { value: "investment", label: "Budget des investissements" },
]

const periods = [
  { value: "january", label: "Janvier 2024" },
  { value: "february", label: "Février 2024" },
  { value: "q1", label: "T1 2024" },
  { value: "2023", label: "Année 2023" },
]

const salesVarianceData = [
  {
    category: "Votre Produit 1",
    budgeted: 45000, // Votre montant budgété
    actual: 48200, // Votre montant réel
    variance: 3200, // Calculez l'écart
    variancePercent: 7.1, // Calculez le pourcentage d'écart
  },
  // Ajoutez vos propres données d'écart
]

const productionVarianceData = [
  {
    category: "Main d'œuvre",
    budgeted: 25000,
    actual: 27300,
    variance: -2300,
    variancePercent: -9.2,
  },
  {
    category: "Matières premières",
    budgeted: 18000,
    actual: 17200,
    variance: 800,
    variancePercent: 4.4,
  },
  {
    category: "Maintenance",
    budgeted: 5000,
    actual: 5800,
    variance: -800,
    variancePercent: -16.0,
  },
  {
    category: "Énergie",
    budgeted: 4500,
    actual: 4700,
    variance: -200,
    variancePercent: -4.4,
  },
]

const chartData = {
  sales: salesVarianceData,
  production: productionVarianceData,
}

export function VarianceAnalysis() {
  const [selectedBudgetType, setSelectedBudgetType] = useState("sales")
  const [selectedPeriod, setSelectedPeriod] = useState("january")

  const data = selectedBudgetType === "sales" ? salesVarianceData : productionVarianceData

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de budget</label>
            <Select value={selectedBudgetType} onValueChange={setSelectedBudgetType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un type de budget" />
              </SelectTrigger>
              <SelectContent>
                {budgetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Période</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une période" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Visualisation des écarts</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
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
                <Bar name="Budget" dataKey="budgeted" fill="#8884d8" />
                <Bar name="Réel" dataKey="actual" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Écarts en pourcentage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar name="Écart (%)" dataKey="variancePercent">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.variancePercent >= 0 ? "#82ca9d" : "#ff8042"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Détail des écarts</h3>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead className="text-right">Budget (€)</TableHead>
                <TableHead className="text-right">Réel (€)</TableHead>
                <TableHead className="text-right">Écart (€)</TableHead>
                <TableHead className="text-right">Écart (%)</TableHead>
                <TableHead>Analyse</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell className="text-right">{item.budgeted.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.actual.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.variance >= 0 ? "+" : ""}
                    {item.variance.toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right ${item.variancePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.variancePercent >= 0 ? "+" : ""}
                    {item.variancePercent.toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    {item.variancePercent > 5
                      ? "Performance supérieure"
                      : item.variancePercent < -5
                        ? "Attention requise"
                        : "Conforme aux prévisions"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Causes potentielles des écarts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Écarts positifs</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Augmentation des ventes due à une campagne marketing efficace</li>
                <li>Réduction des coûts grâce à une meilleure négociation avec les fournisseurs</li>
                <li>Amélioration de l'efficacité des processus de production</li>
                <li>Conditions de marché favorables</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Écarts négatifs</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Augmentation imprévue du coût des matières premières</li>
                <li>Problèmes techniques ayant entraîné des retards de production</li>
                <li>Concurrence accrue sur certains segments de marché</li>
                <li>Prévisions de ventes trop optimistes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
