"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function OptimisationPrix({ data, dataType }) {
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])
  const [priceRange, setPriceRange] = useState([100])
  const [simulationResults, setSimulationResults] = useState(null)

  useEffect(() => {
    if (data && dataType === "optimisation") {
      // Calculate optimal price
      const calculatedResults = calculateOptimalPrice(data)
      setResults(calculatedResults)

      // Set initial price range
      setPriceRange([data.prixVente])

      // Prepare chart data
      const chartData = prepareChartData(data)
      setChartData(chartData)

      // Initial simulation
      const simulation = simulatePrice(data, data.prixVente)
      setSimulationResults(simulation)
    }
  }, [data, dataType])

  const calculateOptimalPrice = (data) => {
    // For elasticity e = -1.5
    // Optimal price formula: P* = CV / (1 + 1/|e|)
    // Where CV is variable cost and e is elasticity

    const elasticity = Math.abs(data.elasticite)
    const optimalPrice = data.coutVariable / (1 - 1 / elasticity)

    // Calculate quantity at optimal price
    // Q2 = Q1 * (1 + e * (P2-P1)/P1)
    const priceChange = (optimalPrice - data.prixVente) / data.prixVente
    const newQuantity = data.quantite * (1 + data.elasticite * priceChange)

    // Calculate profit at optimal price
    const newRevenue = optimalPrice * newQuantity
    const newVariableCost = data.coutVariable * newQuantity
    const newProfit = newRevenue - newVariableCost - data.chargesFixes

    // Calculate current profit
    const currentRevenue = data.prixVente * data.quantite
    const currentVariableCost = data.coutVariable * data.quantite
    const currentProfit = currentRevenue - currentVariableCost - data.chargesFixes

    // Calculate profit improvement
    const profitImprovement = newProfit - currentProfit
    const profitImprovementPercentage = (profitImprovement / currentProfit) * 100

    return {
      optimalPrice,
      newQuantity,
      newRevenue,
      newProfit,
      currentProfit,
      profitImprovement,
      profitImprovementPercentage,
    }
  }

  const simulatePrice = (data, price) => {
    // Calculate quantity at simulated price
    // Q2 = Q1 * (1 + e * (P2-P1)/P1)
    const priceChange = (price - data.prixVente) / data.prixVente
    const newQuantity = data.quantite * (1 + data.elasticite * priceChange)

    // Calculate profit at simulated price
    const newRevenue = price * newQuantity
    const newVariableCost = data.coutVariable * newQuantity
    const newProfit = newRevenue - newVariableCost - data.chargesFixes

    return {
      price,
      quantity: newQuantity,
      revenue: newRevenue,
      variableCost: newVariableCost,
      fixedCost: data.chargesFixes,
      profit: newProfit,
    }
  }

  const prepareChartData = (data) => {
    if (!data) return []

    const chartData = []
    const minPrice = data.coutVariable * 0.8
    const maxPrice = data.prixVente * 1.5
    const step = (maxPrice - minPrice) / 20

    for (let price = minPrice; price <= maxPrice; price += step) {
      const simulation = simulatePrice(data, price)
      chartData.push({
        price: price.toFixed(2),
        profit: simulation.profit,
      })
    }

    return chartData
  }

  const handlePriceChange = (value) => {
    setPriceRange(value)
    if (data) {
      const simulation = simulatePrice(data, value[0])
      setSimulationResults(simulation)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const formatNumber = (value, decimals = 0) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

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

  if (!data || dataType !== "optimisation") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Optimisation des prix</CardTitle>
          <CardDescription>Veuillez importer des données d'optimisation des prix pour commencer</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-60">
          <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Optimisation des prix</CardTitle>
            <CardDescription>{data.company} - Détermination du prix optimal pour maximiser le bénéfice</CardDescription>
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
        <CardContent>
          <Tabs defaultValue="resultats">
            <TabsList className="mb-4">
              <TabsTrigger value="resultats">Résultats</TabsTrigger>
              <TabsTrigger value="graphique">Graphique</TabsTrigger>
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
            </TabsList>

            <TabsContent value="resultats">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Données actuelles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Prix de vente actuel</TableCell>
                          <TableCell className="text-right">{formatCurrency(data.prixVente)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Coût variable unitaire</TableCell>
                          <TableCell className="text-right">{formatCurrency(data.coutVariable)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Charges fixes</TableCell>
                          <TableCell className="text-right">{formatCurrency(data.chargesFixes)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Quantité vendue</TableCell>
                          <TableCell className="text-right">{formatNumber(data.quantite)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Élasticité-prix</TableCell>
                          <TableCell className="text-right">{data.elasticite}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Bénéfice actuel</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatCurrency(results?.currentProfit)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prix optimal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Prix optimal</TableCell>
                          <TableCell className="text-right font-bold text-primary">
                            {formatCurrency(results?.optimalPrice)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Nouvelle quantité estimée</TableCell>
                          <TableCell className="text-right">{formatNumber(results?.newQuantity, 0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Nouveau chiffre d'affaires</TableCell>
                          <TableCell className="text-right">{formatCurrency(results?.newRevenue)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Nouveau bénéfice</TableCell>
                          <TableCell className="text-right font-bold">{formatCurrency(results?.newProfit)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Amélioration du bénéfice</TableCell>
                          <TableCell className="text-right text-green-600 font-bold">
                            +{formatCurrency(results?.profitImprovement)}(
                            {formatNumber(results?.profitImprovementPercentage, 2)}%)
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Interprétation des résultats</h3>
                <p className="text-sm mb-2">
                  Pour un produit avec une élasticité-prix de {data.elasticite}, le prix optimal qui maximise le
                  bénéfice est de {formatCurrency(results?.optimalPrice)}.
                </p>
                <p className="text-sm mb-2">
                  À ce prix, la quantité vendue est estimée à {formatNumber(results?.newQuantity, 0)} unités, générant
                  un bénéfice de {formatCurrency(results?.newProfit)}.
                </p>
                <p className="text-sm font-medium">
                  Cette optimisation représente une amélioration de{" "}
                  {formatNumber(results?.profitImprovementPercentage, 2)}% du bénéfice par rapport à la situation
                  actuelle.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="graphique">
              <div className="h-[500px]">
                <ChartContainer
                  config={{
                    profit: {
                      label: "Bénéfice",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="price" label={{ value: "Prix", position: "bottom", offset: 0 }} />
                      <YAxis label={{ value: "Bénéfice", angle: -90, position: "left" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Analyse du graphique</h3>
                <p className="text-sm">
                  Le graphique montre la relation entre le prix de vente et le bénéfice. Le point culminant de la courbe
                  représente le prix optimal qui maximise le bénéfice. Cette relation est influencée par
                  l'élasticité-prix de la demande ({data.elasticite}), qui détermine comment la quantité vendue réagit
                  aux variations de prix.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="simulation">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Simuler un prix différent</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={priceRange}
                      min={data.coutVariable}
                      max={data.prixVente * 2}
                      step={1}
                      onValueChange={handlePriceChange}
                      className="flex-1"
                    />
                    <div className="w-20 text-center font-medium">{formatCurrency(priceRange[0])}</div>
                  </div>
                </div>

                {simulationResults && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Résultats de la simulation</CardTitle>
                      <CardDescription>
                        Impact d'un prix de vente de {formatCurrency(simulationResults.price)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Quantité estimée</TableCell>
                            <TableCell className="text-right">{formatNumber(simulationResults.quantity, 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Chiffre d'affaires</TableCell>
                            <TableCell className="text-right">{formatCurrency(simulationResults.revenue)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Coûts variables totaux</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(simulationResults.variableCost)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Charges fixes</TableCell>
                            <TableCell className="text-right">{formatCurrency(simulationResults.fixedCost)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Bénéfice</TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(simulationResults.profit)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Comparaison avec l'optimal</TableCell>
                            <TableCell className="text-right">
                              {simulationResults.profit < results.newProfit ? (
                                <span className="text-red-600">
                                  {formatCurrency(simulationResults.profit - results.newProfit)}(
                                  {formatNumber((simulationResults.profit / results.newProfit - 1) * 100, 2)}%)
                                </span>
                              ) : (
                                <span className="text-green-600">
                                  +{formatCurrency(simulationResults.profit - results.newProfit)}
                                  (+{formatNumber((simulationResults.profit / results.newProfit - 1) * 100, 2)}%)
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
