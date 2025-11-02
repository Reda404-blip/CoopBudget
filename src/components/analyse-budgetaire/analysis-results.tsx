"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { FileSpreadsheet, FileIcon as FilePdf, Lightbulb, Sliders } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AnalysisResults({ results, onSimulate }) {
  const [activeTab, setActiveTab] = useState("summary")

  const handleExportExcel = () => {
    // Simulate Excel export
    console.log("Exporting to Excel:", results)
    alert("Export Excel simulé. Cette fonctionnalité serait implémentée avec une bibliothèque comme ExcelJS.")
  }

  const handleExportPDF = () => {
    // Simulate PDF export
    console.log("Exporting to PDF:", results)
    alert("Export PDF simulé. Cette fonctionnalité serait implémentée avec une bibliothèque comme jsPDF.")
  }

  const handleSimulate = () => {
    // Pass simulation parameters to parent
    onSimulate({
      type: results.type,
      baseData: results,
    })
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const formatNumber = (value) => {
    return new Intl.NumberFormat("fr-FR").format(value)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  const formatPercentage = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{results.summary.title}</CardTitle>
          <CardDescription>{results.summary.description}</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <FilePdf className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.summary.metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">{metric.name}</div>
                <div className="text-2xl font-bold mt-1">
                  {metric.unit === "€"
                    ? formatCurrency(metric.value)
                    : metric.unit === "%"
                      ? formatPercentage(metric.value)
                      : formatNumber(metric.value) + (metric.unit ? ` ${metric.unit}` : "")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="chart">Graphique</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6 space-y-6">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Insights</AlertTitle>
              <AlertDescription>
                Voici les principales conclusions de l'analyse :
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Les résultats montrent une tendance positive sur la période analysée.</li>
                  <li>Les écarts les plus significatifs concernent les mois de mars et avril.</li>
                  <li>La performance globale est supérieure aux prévisions de 5.2%.</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicateur</TableHead>
                    <TableHead className="text-right">Valeur</TableHead>
                    <TableHead>Interprétation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="text-right">{formatCurrency(10000)}</TableCell>
                    <TableCell>Montant total analysé</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Variation</TableCell>
                    <TableCell className="text-right text-green-600">+{formatPercentage(5.2)}</TableCell>
                    <TableCell>Variation positive par rapport aux prévisions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Écart</TableCell>
                    <TableCell className="text-right text-green-600">+{formatCurrency(520)}</TableCell>
                    <TableCell>Écart favorable</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Période</TableHead>
                    <TableHead className="text-right">Prévu</TableHead>
                    <TableHead className="text-right">Réalisé</TableHead>
                    <TableHead className="text-right">Écart</TableHead>
                    <TableHead className="text-right">Écart %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Jan</TableCell>
                    <TableCell className="text-right">{formatCurrency(1000)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(950)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency(50)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatPercentage(5)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fév</TableCell>
                    <TableCell className="text-right">{formatCurrency(1200)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(1150)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatCurrency(50)}</TableCell>
                    <TableCell className="text-right text-red-600">-{formatPercentage(4.2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mar</TableCell>
                    <TableCell className="text-right">{formatCurrency(900)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(1100)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatCurrency(200)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatPercentage(22.2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Avr</TableCell>
                    <TableCell className="text-right">{formatCurrency(1500)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(1700)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatCurrency(200)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatPercentage(13.3)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mai</TableCell>
                    <TableCell className="text-right">{formatCurrency(1800)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(1900)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatCurrency(100)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatPercentage(5.6)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Juin</TableCell>
                    <TableCell className="text-right">{formatCurrency(1200)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(1320)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatCurrency(120)}</TableCell>
                    <TableCell className="text-right text-green-600">+{formatPercentage(10)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(7600)}</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(8120)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">+{formatCurrency(520)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">+{formatPercentage(6.8)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-6">
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    label: "Valeur",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" fill="var(--color-value)" name="Valeur" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSimulate}>
          <Sliders className="mr-2 h-4 w-4" />
          Simuler des scénarios
        </Button>
      </CardFooter>
    </Card>
  )
}
