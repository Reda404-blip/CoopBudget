"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const budgetData = [
  { name: "Votre Catégorie 1", value: 35000, color: "#0088FE" },
  { name: "Votre Catégorie 2", value: 15000, color: "#00C49F" },
  // Ajoutez vos propres catégories
]

const progressData = [
  { name: "Votre Budget 1", progress: 75, total: 50000, current: 37500 },
  { name: "Votre Budget 2", progress: 60, total: 25000, current: 15000 },
  // Ajoutez vos propres budgets
]

export function BudgetSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Répartition des budgets</CardTitle>
          <CardDescription>Distribution des différents types de budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `€${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progression des budgets</CardTitle>
          <CardDescription>Avancement par rapport aux objectifs budgétaires</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {progressData.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-muted-foreground">
                  €{item.current.toLocaleString()} / €{item.total.toLocaleString()}
                </span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
