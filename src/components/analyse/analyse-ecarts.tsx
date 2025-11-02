"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function AnalyseEcarts({ data, dataType }) {
  const [results, setResults] = useState(null)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (data && dataType === "ecarts") {
      // Calculate results
      const calculatedResults = calculateEcarts(data)
      setResults(calculatedResults)

      // Prepare chart data
      const chartData = prepareChartData(calculatedResults)
      setChartData(chartData)
    }
  }, [data, dataType])

  const calculateEcarts = (data) => {
    // Process the data to calculate variances
    return data.products.map((product) => {
      const caPrevu = product.quantitePrevu * product.prixPrevu
      const caRealise = product.quantiteRealise * product.prixRealise
      const ecartTotal = caRealise - caPrevu

      const ecartPrix = (product.prixRealise - product.prixPrevu) * product.quantiteRealise
      const ecartQuantite = (product.quantiteRealise - product.quantitePrevu) * product.prixPrevu

      // Verify that ecartTotal = ecartPrix + ecartQuantite (with rounding)
      const verificationEcart = Math.abs(ecartPrix + ecartQuantite - ecartTotal) < 0.01

      return {
        ...product,
        caPrevu,
        caRealise,
        ecartTotal,
        ecartPrix,
        ecartQuantite,
        verificationEcart,
      }
    })
  }

  const prepareChartData = (results) => {
    if (!results) return []

    return results.map((product) => ({
      name: product.nom,
      "CA Prévu": product.caPrevu,
      "CA Réalisé": product.caRealise,
      "Écart Prix": product.ecartPrix,
      "Écart Quantité": product.ecartQuantite,
    }))
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getEcartClass = (value) => {
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

  if (!data || dataType !== "ecarts") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyse des écarts</CardTitle>
          <CardDescription>Veuillez importer des données d'analyse des écarts pour commencer</CardDescription>
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
            <CardTitle>Analyse des écarts sur chiffre d'affaires</CardTitle>
            <CardDescription>{data.company} - Analyse détaillée des écarts sur CA</CardDescription>
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
          <Tabs defaultValue="tableau">
            <TabsList className="mb-4">
              <TabsTrigger value="tableau">Tableau d'analyse</TabsTrigger>
              <TabsTrigger value="graphique">Graphique</TabsTrigger>
            </TabsList>

            <TabsContent value="tableau">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">CA Prévu</TableHead>
                      <TableHead className="text-right">CA Réalisé</TableHead>
                      <TableHead className="text-right">Écart Total</TableHead>
                      <TableHead className="text-right">Écart sur Prix</TableHead>
                      <TableHead className="text-right">Écart sur Quantité</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results &&
                      results.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{product.nom}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.caPrevu)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(product.caRealise)}</TableCell>
                          <TableCell className={`text-right ${getEcartClass(product.ecartTotal)}`}>
                            {formatCurrency(product.ecartTotal)}
                          </TableCell>
                          <TableCell className={`text-right ${getEcartClass(product.ecartPrix)}`}>
                            {formatCurrency(product.ecartPrix)}
                          </TableCell>
                          <TableCell className={`text-right ${getEcartClass(product.ecartQuantite)}`}>
                            {formatCurrency(product.ecartQuantite)}
                          </TableCell>
                        </TableRow>
                      ))}
                    {results && (
                      <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(results.reduce((sum, p) => sum + p.caPrevu, 0))}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(results.reduce((sum, p) => sum + p.caRealise, 0))}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${getEcartClass(results.reduce((sum, p) => sum + p.ecartTotal, 0))}`}
                        >
                          {formatCurrency(results.reduce((sum, p) => sum + p.ecartTotal, 0))}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${getEcartClass(results.reduce((sum, p) => sum + p.ecartPrix, 0))}`}
                        >
                          {formatCurrency(results.reduce((sum, p) => sum + p.ecartPrix, 0))}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${getEcartClass(results.reduce((sum, p) => sum + p.ecartQuantite, 0))}`}
                        >
                          {formatCurrency(results.reduce((sum, p) => sum + p.ecartQuantite, 0))}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Interprétation des résultats</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium">Écart total :</span> Différence entre le CA réalisé et le CA prévu
                  </li>
                  <li>
                    <span className="font-medium">Écart sur prix :</span> (Prix réalisé - Prix prévu) × Quantité
                    réalisée
                  </li>
                  <li>
                    <span className="font-medium">Écart sur quantité :</span> (Quantité réalisée - Quantité prévue) ×
                    Prix prévu
                  </li>
                  <li>
                    <span className="text-green-600 font-medium">Valeur positive :</span> Écart favorable
                  </li>
                  <li>
                    <span className="text-red-600 font-medium">Valeur négative :</span> Écart défavorable
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="graphique">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    "CA Prévu": {
                      label: "CA Prévu",
                      color: "hsl(var(--chart-1))",
                    },
                    "CA Réalisé": {
                      label: "CA Réalisé",
                      color: "hsl(var(--chart-2))",
                    },
                    "Écart Prix": {
                      label: "Écart Prix",
                      color: "hsl(var(--chart-3))",
                    },
                    "Écart Quantité": {
                      label: "Écart Quantité",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="CA Prévu" fill="var(--color-CA Prévu)" />
                      <Bar dataKey="CA Réalisé" fill="var(--color-CA Réalisé)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 h-[400px]">
                <ChartContainer
                  config={{
                    "Écart Prix": {
                      label: "Écart Prix",
                      color: "hsl(var(--chart-3))",
                    },
                    "Écart Quantité": {
                      label: "Écart Quantité",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="Écart Prix" fill="var(--color-Écart Prix)" />
                      <Bar dataKey="Écart Quantité" fill="var(--color-Écart Quantité)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
