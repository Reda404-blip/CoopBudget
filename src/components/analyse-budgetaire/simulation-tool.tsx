"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, RefreshCw } from "lucide-react"

export function SimulationTool({ initialParams, data, results }) {
  const [simulationParams, setSimulationParams] = useState({
    priceChange: 0,
    quantityChange: 0,
    costChange: 0,
  })
  const [simulationResults, setSimulationResults] = useState(null)
  const [comparisonData, setComparisonData] = useState([])
  const [optimumFound, setOptimumFound] = useState(null)

  useEffect(() => {
    // Run initial simulation
    runSimulation(simulationParams)
  }, [])

  const runSimulation = (params) => {
    // This would be a complex calculation based on the data and parameters
    // For this example, we'll create a simple simulation

    const baseValue = 10000
    const priceEffect = baseValue * (params.priceChange / 100) * -1.5 // Assuming price elasticity of -1.5
    const quantityEffect = baseValue * (params.quantityChange / 100)
    const costEffect = baseValue * (params.costChange / 100) * -1

    const newValue = baseValue + priceEffect + quantityEffect + costEffect
    const percentChange = (newValue / baseValue - 1) * 100

    const simulatedResults = {
      baseValue,
      newValue,
      percentChange,
      breakdown: {
        priceEffect,
        quantityEffect,
        costEffect,
      },
    }

    setSimulationResults(simulatedResults)

    // Prepare comparison data for chart
    setComparisonData([
      { name: "Base", value: baseValue },
      { name: "Simulé", value: newValue },
    ])

    // Check if we found an optimum
    if (Math.abs(params.priceChange) > 5 && newValue > baseValue * 1.1) {
      setOptimumFound({
        message: `Une augmentation de ${params.priceChange}% du prix semble optimale`,
        improvement: percentChange,
      })
    } else {
      setOptimumFound(null)
    }
  }

  const handleParamChange = (param, value) => {
    const newParams = { ...simulationParams, [param]: value }
    setSimulationParams(newParams)
    runSimulation(newParams)
  }

  const handleSliderChange = (param, value) => {
    handleParamChange(param, value[0])
  }

  const handleInputChange = (param, e) => {
    const value = Number.parseFloat(e.target.value) || 0
    handleParamChange(param, value)
  }

  const handleReset = () => {
    const resetParams = {
      priceChange: 0,
      quantityChange: 0,
      costChange: 0,
    }
    setSimulationParams(resetParams)
    runSimulation(resetParams)
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
      <CardHeader>
        <CardTitle>Simulation de scénarios</CardTitle>
        <CardDescription>Testez différents scénarios pour évaluer leur impact sur vos résultats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Variation de prix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[simulationParams.priceChange]}
                    min={-20}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleSliderChange("priceChange", value)}
                    className="flex-1"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      value={simulationParams.priceChange}
                      onChange={(e) => handleInputChange("priceChange", e)}
                      className="text-center"
                    />
                  </div>
                  <div className="w-6 text-sm">%</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {simulationParams.priceChange > 0
                    ? `Augmentation de ${simulationParams.priceChange}% du prix`
                    : simulationParams.priceChange < 0
                      ? `Réduction de ${Math.abs(simulationParams.priceChange)}% du prix`
                      : "Aucun changement de prix"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Variation de quantité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[simulationParams.quantityChange]}
                    min={-20}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleSliderChange("quantityChange", value)}
                    className="flex-1"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      value={simulationParams.quantityChange}
                      onChange={(e) => handleInputChange("quantityChange", e)}
                      className="text-center"
                    />
                  </div>
                  <div className="w-6 text-sm">%</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {simulationParams.quantityChange > 0
                    ? `Augmentation de ${simulationParams.quantityChange}% de la quantité`
                    : simulationParams.quantityChange < 0
                      ? `Réduction de ${Math.abs(simulationParams.quantityChange)}% de la quantité`
                      : "Aucun changement de quantité"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Variation de coût</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[simulationParams.costChange]}
                    min={-20}
                    max={20}
                    step={1}
                    onValueChange={(value) => handleSliderChange("costChange", value)}
                    className="flex-1"
                  />
                  <div className="w-16">
                    <Input
                      type="number"
                      value={simulationParams.costChange}
                      onChange={(e) => handleInputChange("costChange", e)}
                      className="text-center"
                    />
                  </div>
                  <div className="w-6 text-sm">%</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {simulationParams.costChange > 0
                    ? `Augmentation de ${simulationParams.costChange}% des coûts`
                    : simulationParams.costChange < 0
                      ? `Réduction de ${Math.abs(simulationParams.costChange)}% des coûts`
                      : "Aucun changement de coûts"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {simulationResults && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Résultats de la simulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Valeur de base</TableCell>
                            <TableCell className="text-right">{formatCurrency(simulationResults.baseValue)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Nouvelle valeur</TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(simulationResults.newValue)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Variation</TableCell>
                            <TableCell
                              className={`text-right font-bold ${simulationResults.percentChange >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {simulationResults.percentChange >= 0 ? "+" : ""}
                              {formatPercentage(simulationResults.percentChange)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Décomposition de l'impact</h3>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Impact du prix</TableCell>
                              <TableCell
                                className={`text-right ${simulationResults.breakdown.priceEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {simulationResults.breakdown.priceEffect >= 0 ? "+" : ""}
                                {formatCurrency(simulationResults.breakdown.priceEffect)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Impact de la quantité</TableCell>
                              <TableCell
                                className={`text-right ${simulationResults.breakdown.quantityEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {simulationResults.breakdown.quantityEffect >= 0 ? "+" : ""}
                                {formatCurrency(simulationResults.breakdown.quantityEffect)}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Impact des coûts</TableCell>
                              <TableCell
                                className={`text-right ${simulationResults.breakdown.costEffect >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {simulationResults.breakdown.costEffect >= 0 ? "+" : ""}
                                {formatCurrency(simulationResults.breakdown.costEffect)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparaison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Valeur",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                </CardContent>
              </Card>
            </div>

            {optimumFound && (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Optimum détecté</AlertTitle>
                <AlertDescription>
                  {optimumFound.message}, ce qui pourrait améliorer vos résultats de{" "}
                  {formatPercentage(optimumFound.improvement)}.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={handleReset} className="mr-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      </CardFooter>
    </Card>
  )
}
