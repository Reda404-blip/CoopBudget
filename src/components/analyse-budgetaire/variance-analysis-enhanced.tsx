"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts"
import {
  BarChart2,
  Calculator,
  Download,
  FileSpreadsheet,
  FileText,
  LineChartIcon,
  Lightbulb,
  Sliders,
  TableIcon,
} from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function VarianceAnalysisEnhanced() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("table")
  const [period, setPeriod] = useState("all")
  const [category, setCategory] = useState("all")
  const [threshold, setThreshold] = useState(10)
  const [showPercentage, setShowPercentage] = useState(true)
  const [highlightSignificant, setHighlightSignificant] = useState(true)
  const [showTotals, setShowTotals] = useState(true)
  const [sortBy, setSortBy] = useState("variance")
  const [sortOrder, setSortOrder] = useState("desc")
  const [analysisResults, setAnalysisResults] = useState(null)

  // Sample data
  const data = [
    {
      id: 1,
      period: "Jan 2023",
      category: "Produits A",
      budget: 10000,
      actual: 9500,
      variance: -500,
      variancePercent: -5,
    },
    {
      id: 2,
      period: "Jan 2023",
      category: "Produits B",
      budget: 15000,
      actual: 16200,
      variance: 1200,
      variancePercent: 8,
    },
    {
      id: 3,
      period: "Jan 2023",
      category: "Produits C",
      budget: 8000,
      actual: 7200,
      variance: -800,
      variancePercent: -10,
    },
    {
      id: 4,
      period: "Fév 2023",
      category: "Produits A",
      budget: 11000,
      actual: 12100,
      variance: 1100,
      variancePercent: 10,
    },
    {
      id: 5,
      period: "Fév 2023",
      category: "Produits B",
      budget: 14000,
      actual: 13300,
      variance: -700,
      variancePercent: -5,
    },
    {
      id: 6,
      period: "Fév 2023",
      category: "Produits C",
      budget: 9000,
      actual: 10800,
      variance: 1800,
      variancePercent: 20,
    },
    {
      id: 7,
      period: "Mar 2023",
      category: "Produits A",
      budget: 12000,
      actual: 11400,
      variance: -600,
      variancePercent: -5,
    },
    {
      id: 8,
      period: "Mar 2023",
      category: "Produits B",
      budget: 16000,
      actual: 18400,
      variance: 2400,
      variancePercent: 15,
    },
    {
      id: 9,
      period: "Mar 2023",
      category: "Produits C",
      budget: 9500,
      actual: 7600,
      variance: -1900,
      variancePercent: -20,
    },
  ]

  // Filter and sort data
  const filteredData = data
    .filter((item) => {
      if (period !== "all" && item.period !== period) return false
      if (category !== "all" && item.category !== category) return false
      return true
    })
    .sort((a, b) => {
      const field = sortBy
      const order = sortOrder === "asc" ? 1 : -1

      if (a[field] < b[field]) return -1 * order
      if (a[field] > b[field]) return 1 * order
      return 0
    })

  // Calculate totals
  const totals = filteredData.reduce(
    (acc, item) => {
      acc.budget += item.budget
      acc.actual += item.actual
      acc.variance += item.variance
      return acc
    },
    { budget: 0, actual: 0, variance: 0 },
  )

  totals.variancePercent = totals.budget !== 0 ? (totals.variance / totals.budget) * 100 : 0

  // Prepare chart data
  const chartData =
    period === "all"
      ? data.reduce((acc, item) => {
          const existingPeriod = acc.find((p) => p.name === item.period)
          if (existingPeriod) {
            existingPeriod.budget += item.budget
            existingPeriod.actual += item.actual
            existingPeriod.variance += item.variance
          } else {
            acc.push({
              name: item.period,
              budget: item.budget,
              actual: item.actual,
              variance: item.variance,
            })
          }
          return acc
        }, [])
      : data
          .filter((item) => item.period === period)
          .map((item) => ({
            name: item.category,
            budget: item.budget,
            actual: item.actual,
            variance: item.variance,
          }))

  // Prepare distribution data
  const distributionData =
    category === "all"
      ? data.reduce((acc, item) => {
          const existingCategory = acc.find((c) => c.name === item.category)
          if (existingCategory) {
            existingCategory.value += Math.abs(item.variance)
          } else {
            acc.push({
              name: item.category,
              value: Math.abs(item.variance),
            })
          }
          return acc
        }, [])
      : data
          .filter((item) => item.category === category)
          .map((item) => ({
            name: item.period,
            value: Math.abs(item.variance),
          }))

  const handleRunAnalysis = () => {
    setIsLoading(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate analysis
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      // Set analysis results
      setAnalysisResults({
        summary: {
          totalBudget: totals.budget,
          totalActual: totals.actual,
          totalVariance: totals.variance,
          totalVariancePercent: totals.variancePercent,
          significantVariances: filteredData.filter((item) => Math.abs(item.variancePercent) >= threshold).length,
          positiveVariances: filteredData.filter((item) => item.variance > 0).length,
          negativeVariances: filteredData.filter((item) => item.variance < 0).length,
        },
        insights: [
          {
            type: "positive",
            message: "Les produits B en Mars 2023 ont dépassé le budget de 15%, ce qui est significatif.",
          },
          {
            type: "negative",
            message:
              "Les produits C en Mars 2023 sont 20% en dessous du budget, ce qui nécessite une attention particulière.",
          },
          {
            type: "neutral",
            message: "La tendance globale montre une légère amélioration au fil des mois.",
          },
        ],
      })

      setIsLoading(false)
    }, 2000)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  const getVarianceColor = (variance, variancePercent) => {
    if (Math.abs(variancePercent) < threshold) {
      return "text-gray-700 dark:text-gray-300"
    }
    return variance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  const getVarianceBgColor = (variance, variancePercent) => {
    if (!highlightSignificant || Math.abs(variancePercent) < threshold) {
      return ""
    }
    return variance >= 0 ? "bg-green-50 dark:bg-green-950" : "bg-red-50 dark:bg-red-950"
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Configuration de l'analyse</CardTitle>
            <CardDescription>Configurez les paramètres pour l'analyse des écarts budgétaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Période</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Sélectionnez une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les périodes</SelectItem>
                    <SelectItem value="Jan 2023">Janvier 2023</SelectItem>
                    <SelectItem value="Fév 2023">Février 2023</SelectItem>
                    <SelectItem value="Mar 2023">Mars 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Produits A">Produits A</SelectItem>
                    <SelectItem value="Produits B">Produits B</SelectItem>
                    <SelectItem value="Produits C">Produits C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold">Seuil d'écart significatif (%)</Label>
                  <span className="text-sm text-muted-foreground">{threshold}%</span>
                </div>
                <Slider
                  id="threshold"
                  value={[threshold]}
                  min={5}
                  max={25}
                  step={1}
                  onValueChange={(value) => setThreshold(value[0])}
                />
              </div>

              <div className="space-y-2">
                <Label>Options d'affichage</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-percentage" checked={showPercentage} onCheckedChange={setShowPercentage} />
                    <label
                      htmlFor="show-percentage"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Afficher les pourcentages
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="highlight-significant"
                      checked={highlightSignificant}
                      onCheckedChange={setHighlightSignificant}
                    />
                    <label
                      htmlFor="highlight-significant"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Mettre en évidence les écarts significatifs
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="show-totals" checked={showTotals} onCheckedChange={setShowTotals} />
                    <label
                      htmlFor="show-totals"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Afficher les totaux
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="sort-by" className="whitespace-nowrap">
                  Trier par
                </Label>
                <Select value={sortBy} onValueChange={setSortBy} className="w-[180px]">
                  <SelectTrigger id="sort-by">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="period">Période</SelectItem>
                    <SelectItem value="category">Catégorie</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="actual">Réel</SelectItem>
                    <SelectItem value="variance">Écart</SelectItem>
                    <SelectItem value="variancePercent">Écart %</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="h-9 w-9"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </Button>
              </div>

              <Button onClick={handleRunAnalysis} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Calculator className="mr-2 h-4 w-4 animate-pulse" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-4 w-4" />
                    Lancer l'analyse
                  </>
                )}
              </Button>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analyse en cours...</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {analysisResults && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Résultats de l'analyse</CardTitle>
                  <CardDescription>Analyse des écarts entre les valeurs budgétées et réalisées</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Lightbulb className="mr-2 h-4 w-4" />
                        Insights
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Insights automatiques</SheetTitle>
                        <SheetDescription>Analyse automatique des écarts budgétaires</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-4">
                        {analysisResults.insights.map((insight, index) => (
                          <Alert
                            key={index}
                            variant={
                              insight.type === "negative"
                                ? "destructive"
                                : insight.type === "positive"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>{insight.message}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Rapport
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analysisResults.summary.totalBudget)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Réalisé total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analysisResults.summary.totalActual)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Écart total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${getVarianceColor(analysisResults.summary.totalVariance, analysisResults.summary.totalVariancePercent)}`}
                    >
                      {analysisResults.summary.totalVariance >= 0 ? "+" : ""}
                      {formatCurrency(analysisResults.summary.totalVariance)}
                      {showPercentage && (
                        <span className="text-sm ml-1">
                          ({analysisResults.summary.totalVariancePercent >= 0 ? "+" : ""}
                          {formatPercentage(analysisResults.summary.totalVariancePercent)})
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Écarts significatifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analysisResults.summary.significantVariances}
                      <span className="text-sm ml-1 text-muted-foreground">
                        ({analysisResults.summary.positiveVariances} positifs,{" "}
                        {analysisResults.summary.negativeVariances} négatifs)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="table" className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span>Tableau</span>
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    <span>Graphique</span>
                  </TabsTrigger>
                  <TabsTrigger value="distribution" className="flex items-center gap-2">
                    <LineChartIcon className="h-4 w-4" />
                    <span>Distribution</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="table" className="mt-6">
                  <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Période</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead className="text-right">Budget</TableHead>
                            <TableHead className="text-right">Réalisé</TableHead>
                            <TableHead className="text-right">Écart</TableHead>
                            {showPercentage && <TableHead className="text-right">Écart %</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredData.map((item) => (
                            <TableRow key={item.id} className={getVarianceBgColor(item.variance, item.variancePercent)}>
                              <TableCell>{item.period}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.budget)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.actual)}</TableCell>
                              <TableCell
                                className={`text-right ${getVarianceColor(item.variance, item.variancePercent)}`}
                              >
                                {item.variance >= 0 ? "+" : ""}
                                {formatCurrency(item.variance)}
                              </TableCell>
                              {showPercentage && (
                                <TableCell
                                  className={`text-right ${getVarianceColor(item.variance, item.variancePercent)}`}
                                >
                                  {item.variancePercent >= 0 ? "+" : ""}
                                  {formatPercentage(item.variancePercent)}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                          {showTotals && (
                            <TableRow className="font-bold bg-muted">
                              <TableCell colSpan={2}>Total</TableCell>
                              <TableCell className="text-right">{formatCurrency(totals.budget)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(totals.actual)}</TableCell>
                              <TableCell
                                className={`text-right ${getVarianceColor(totals.variance, totals.variancePercent)}`}
                              >
                                {totals.variance >= 0 ? "+" : ""}
                                {formatCurrency(totals.variance)}
                              </TableCell>
                              {showPercentage && (
                                <TableCell
                                  className={`text-right ${getVarianceColor(totals.variance, totals.variancePercent)}`}
                                >
                                  {totals.variancePercent >= 0 ? "+" : ""}
                                  {formatPercentage(totals.variancePercent)}
                                </TableCell>
                              )}
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chart" className="mt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
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
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="budget" name="Budget" fill="#8884d8" />
                        <Bar dataKey="actual" name="Réalisé" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="distribution" className="mt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={distributionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="value" name="Écart absolu" fill="#8884d8">
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                <Download className="mr-2 h-4 w-4" />
                Exporter les résultats
              </Button>
              <Button>
                <Sliders className="mr-2 h-4 w-4" />
                Simuler des scénarios
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
