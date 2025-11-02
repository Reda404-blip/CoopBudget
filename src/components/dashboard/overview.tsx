"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  {
    name: "Jan",
    dépenses: 4000, // Remplacez par vos chiffres
    revenus: 5400, // Remplacez par vos chiffres
    budget: 5000, // Remplacez par vos chiffres
  },
  {
    name: "Fév",
    dépenses: 3500,
    revenus: 4200,
    budget: 4800,
  },
  {
    name: "Mar",
    dépenses: 5000,
    revenus: 6800,
    budget: 6000,
  },
  {
    name: "Avr",
    dépenses: 4500,
    revenus: 5300,
    budget: 5500,
  },
  {
    name: "Mai",
    dépenses: 3800,
    revenus: 5900,
    budget: 5200,
  },
  {
    name: "Juin",
    dépenses: 4200,
    revenus: 6100,
    budget: 5800,
  },
]

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vue d'ensemble</CardTitle>
        <CardDescription>Comparaison des dépenses, revenus et budgets des 6 derniers mois</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="dépenses" fill="#ff8042" name="Dépenses" />
            <Bar dataKey="revenus" fill="#82ca9d" name="Revenus" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
