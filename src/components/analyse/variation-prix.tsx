"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function VariationPrix({ data, dataType }) {
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])
  const [variationRange, setVariationRange] = useState([-5])
  const [simulationResults, setSimulationResults] = useState(null)

  useEffect(() => {
    if (data && dataType === "variation") {
      // Calculate impact of price variation
      const calculatedResults = calculateVariationImpact(data, -5) // Default -5%
      setResults(calculatedResults)

      // Set initial variation range
      setVariationRange([-5])

      // Prepare chart data
      const chartData = prepareChartData(data)
      setChartData(chartData)

      // Initial simulation
      const simulation = calculateVariationImpact(data, -5)
      setSimulationResults(simulation)
    }
  }, [data, dataType])

  const calculateVariationImpact = (data, variationPct) => {
    // Current situation
    const prixInitial = data.prixVente
    const quantiteInitiale = data.quantiteNormale
    const coutVariable = data.coutVariable
    const chargesFixes = data.chargesFixes

    // Calculate new price
    const nouveauPrix = prixInitial * (1 + variationPct / 100)

    // Calculate new quantity based on elasticity
    // Q2 = Q1 * (1 + e * (P2-P1)/P1)
    const variationPrix = (nouveauPrix - prixInitial) / prixInitial
    const nouvelleQuantite = quantiteInitiale * (1 + data.elasticite * variationPrix)

    // Calculate results
    const caInitial = prixInitial * quantiteInitiale
    const caNouveau = nouveauPrix * nouvelleQuantite
    const variationCA = caNouveau - caInitial
    const variationCAPct = (variationCA / caInitial) * 100

    // Calculate margins
    const margeUnitaireInitiale = prixInitial - coutVariable
    const margeUnitaireNouvelle = nouveauPrix - coutVariable
    const variationMargeUnitaire = margeUnitaireNouvelle - margeUnitaireInitiale
    const variationMargeUnitairePct = (variationMargeUnitaire / margeUnitaireInitiale) * 100

    // Calculate total margins
    const margeTotaleInitiale = margeUnitaireInitiale * quantiteInitiale
    const margeTotaleNouvelle = margeUnitaireNouvelle * nouvelleQuantite
    const variationMargeTotale = margeTotaleNouvelle - margeTotaleInitiale
    const variationMargeTotalePct = (variationMargeTotale / margeTotaleInitiale) * 100

    // Calculate profits
    const resultatInitial = margeTotaleInitiale - chargesFixes
    const resultatNouveau = margeTotaleNouvelle - chargesFixes
    const variationResultat = resultatNouveau - resultatInitial
    const variationResultatPct = (variationResultat / resultatInitial) * 100

    return {
      prixInitial,
      nouveauPrix,
      variationPrix: variationPct,
      quantiteInitiale,
      nouvelleQuantite,
      variationQuantite: nouvelleQuantite - quantiteInitiale,
      variationQuantitePct: ((nouvelleQuantite - quantiteInitiale) / quantiteInitiale) * 100,
      caInitial,
      caNouveau,
      variationCA,
      variationCAPct,
      margeUnitaireInitiale,
      margeUnitaireNouvelle,
      variationMargeUnitaire,
      variationMargeUnitairePct,
      margeTotaleInitiale,
      margeTotaleNouvelle,
      variationMargeTotale,
      variationMargeTotalePct,
      resultatInitial,
      resultatNouveau,
      variationResultat,
      variationResultatPct,
    }
  }

  const prepareChartData = (data) => {
    if (!data) return []

    const chartData = []
    const minVariation = -20
    const maxVariation = 20
    const step = 1

    for (let variation = minVariation; variation <= maxVariation; variation += step) {
      const result = calculateVariationImpact(data, variation)
      chartData.push({
        variation: variation,
        resultat: result.resultatNouveau,
        ca: result.caNouveau,
        quantite: result.nouvelleQuantite,
      })
    }

    return chartData
  }

  const handleVariationChange = (value) => {
    setVariationRange(value)
    if (data) {
      const simulation = calculateVariationImpact(data, value[0])
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

  const formatPercentage = (value, decimals = 2) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100)
  }

  const getVariationClass = (value) => {
    if (value > 0) return "text-green-600 font-medium"
    if (value < 0) return "text-red-600 font-medium"
    return ""
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

  if (!data || dataType !== "variation") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Impact des variations de prix</CardTitle>
          <CardDescription>Veuillez importer des données d'analyse d'impact pour commencer</CardDescription>
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
            <CardTitle>Impact des variations de prix</CardTitle>
            <CardDescription>
              {data.company} - Analyse de l'impact d'une variation de prix sur le résultat
            </CardDescription>
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Indicateur</TableHead>
                      <TableHead className="text-right">Situation actuelle</TableHead>
                      <TableHead className="text-right">Après baisse de 5%</TableHead>
                      <TableHead className="text-right">Variation</TableHead>
                      <TableHead className="text-right">Variation %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Prix de vente</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.prixInitial)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.nouveauPrix)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(results?.nouveauPrix - results?.prixInitial)}
                      </TableCell>
                      <TableCell className="text-right">{formatPercentage(results?.variationPrix)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Quantité vendue</TableCell>
                      <TableCell className="text-right">{formatNumber(results?.quantiteInitiale)}</TableCell>
                      <TableCell className="text-right">{formatNumber(results?.nouvelleQuantite)}</TableCell>
                      <TableCell className="text-right">{formatNumber(results?.variationQuantite)}</TableCell>
                      <TableCell className="text-right">{formatPercentage(results?.variationQuantitePct)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Chiffre d'affaires</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.caInitial)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.caNouveau)}</TableCell>
                      <TableCell className={`text-right ${getVariationClass(results?.variationCA)}`}>
                        {formatCurrency(results?.variationCA)}
                      </TableCell>
                      <TableCell className={`text-right ${getVariationClass(results?.variationCAPct)}`}>
                        {formatPercentage(results?.variationCAPct)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marge unitaire</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.margeUnitaireInitiale)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.margeUnitaireNouvelle)}</TableCell>
                      <TableCell className={`text-right ${getVariationClass(results?.variationMargeUnitaire)}`}>
                        {formatCurrency(results?.variationMargeUnitaire)}
                      </TableCell>
                      <TableCell className={`text-right ${getVariationClass(results?.variationMargeUnitairePct)}`}>
                        {formatPercentage(results?.variationMargeUnitairePct)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Marge totale</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.margeTotaleInitiale)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(results?.margeTotaleNouvelle)}</TableCell>
                      <TableCell className={`text-right ${getVariationClass(results?.variationMargeTotale)}`}>
                        {formatCurrency(results?.variationMargeTotale)}
                      </TableCell>
                      <TableCell className={`text-right ${getVariationClass(results?.variationMargeTotalePct)}`}>
                        {formatPercentage(results?.variationMargeTotalePct)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Résultat</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(results?.resultatInitial)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(results?.resultatNouveau)}</TableCell>
                      <TableCell className={`text-right font-bold ${getVariationClass(results?.variationResultat)}`}>
                        {formatCurrency(results?.variationResultat)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getVariationClass(results?.variationResultatPct)}`}>
                        {formatPercentage(results?.variationResultatPct)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Interprétation des résultats</h3>
                <p className="text-sm mb-2">
                  Une baisse de prix de 5% entraîne une augmentation de la quantité vendue de{" "}
                  {formatPercentage(results?.variationQuantitePct)} en raison de l'élasticité-prix de {data.elasticite}.
                </p>
                <p className="text-sm mb-2">
                  Bien que la marge unitaire diminue de {formatPercentage(results?.variationMargeUnitairePct)},
                  l'augmentation des ventes compense partiellement cette baisse.
                </p>
                <p className="text-sm font-medium">
                  {results?.variationResultatPct > 0 ? (
                    <span className="text-green-600">
                      Le résultat global augmente de {formatPercentage(results?.variationResultatPct)}, ce qui rend
                      cette stratégie de baisse de prix rentable.
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Le résultat global diminue de {formatPercentage(Math.abs(results?.variationResultatPct))}, ce qui
                      rend cette stratégie de baisse de prix non rentable.
                    </span>
                  )}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="graphique">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    resultat: {
                      label: "Résultat",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="variation"
                        label={{ value: "Variation de prix (%)", position: "bottom", offset: 0 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis label={{ value: "Résultat", angle: -90, position: "left" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="resultat" stroke="var(--color-resultat)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 h-[400px]">
                <ChartContainer
                  config={{
                    ca: {
                      label: "Chiffre d'affaires",
                      color: "hsl(var(--chart-2))",
                    },
                    quantite: {
                      label: "Quantité",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="variation"
                        label={{ value: "Variation de prix (%)", position: "bottom", offset: 0 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        label={{ value: "Chiffre d'affaires", angle: -90, position: "left" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: "Quantité", angle: 90, position: "right" }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="ca" stroke="var(--color-ca)" yAxisId="left" />
                      <Line type="monotone" dataKey="quantite" stroke="var(--color-quantite)" yAxisId="right" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="simulation">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Simuler une variation de prix différente</h3>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={variationRange}
                      min={-20}
                      max={20}
                      step={0.5}
                      onValueChange={handleVariationChange}
                      className="flex-1"
                    />
                    <div className="w-20 text-center font-medium">{variationRange[0]}%</div>
                  </div>
                </div>

                {simulationResults && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Résultats de la simulation</CardTitle>
                      <CardDescription>
                        Impact d'une variation de prix de {simulationResults.variationPrix}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Indicateur</TableHead>
                            <TableHead className="text-right">Valeur</TableHead>
                            <TableHead className="text-right">Variation</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Prix de vente</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(simulationResults.nouveauPrix)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPercentage(simulationResults.variationPrix)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Quantité vendue</TableCell>
                            <TableCell className="text-right">
                              {formatNumber(simulationResults.nouvelleQuantite)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatPercentage(simulationResults.variationQuantitePct)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Chiffre d'affaires</TableCell>
                            <TableCell className="text-right">{formatCurrency(simulationResults.caNouveau)}</TableCell>
                            <TableCell className={`text-right ${getVariationClass(simulationResults.variationCAPct)}`}>
                              {formatPercentage(simulationResults.variationCAPct)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Marge unitaire</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(simulationResults.margeUnitaireNouvelle)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${getVariationClass(simulationResults.variationMargeUnitairePct)}`}
                            >
                              {formatPercentage(simulationResults.variationMargeUnitairePct)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Marge totale</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(simulationResults.margeTotaleNouvelle)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${getVariationClass(simulationResults.variationMargeTotalePct)}`}
                            >
                              {formatPercentage(simulationResults.variationMargeTotalePct)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Résultat</TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(simulationResults.resultatNouveau)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-bold ${getVariationClass(simulationResults.variationResultatPct)}`}
                            >
                              {formatPercentage(simulationResults.variationResultatPct)}
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
