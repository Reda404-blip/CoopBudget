"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function BudgetVentes({ data, dataType }) {
  const [budgetParZone, setBudgetParZone] = useState(null)
  const [budgetParPeriode, setBudgetParPeriode] = useState(null)
  const [budgetParProduit, setBudgetParProduit] = useState(null)
  const [budgetGlobal, setBudgetGlobal] = useState(null)
  const [chartDataZone, setChartDataZone] = useState([])
  const [chartDataPeriode, setChartDataPeriode] = useState([])
  const [chartDataProduit, setChartDataProduit] = useState([])

  useEffect(() => {
    if (data && dataType === "budget") {
      // Process data to create different budget views
      const parZone = prepareBudgetParZone(data)
      setBudgetParZone(parZone)

      const parPeriode = prepareBudgetParPeriode(data)
      setBudgetParPeriode(parPeriode)

      const parProduit = prepareBudgetParProduit(data)
      setBudgetParProduit(parProduit)

      const global = prepareBudgetGlobal(data)
      setBudgetGlobal(global)

      // Prepare chart data
      setChartDataZone(prepareChartDataZone(parZone))
      setChartDataPeriode(prepareChartDataPeriode(parPeriode))
      setChartDataProduit(prepareChartDataProduit(parProduit))
    }
  }, [data, dataType])

  const prepareBudgetParZone = (data) => {
    const zones = ["Maroc", "Étranger"]
    const produits = ["Produit 1", "Produit 2", "Produit 3"]
    const result = {}

    zones.forEach((zone) => {
      result[zone] = {
        total: 0,
        produits: {},
      }

      produits.forEach((produit) => {
        const ventesZone = data[zone.toLowerCase()]
        const ventesProduit = ventesZone[produit.replace(" ", "").toLowerCase()]

        const totalProduit = Object.values(ventesProduit).reduce((sum, qty) => sum + Number(qty), 0)
        result[zone].produits[produit] = totalProduit
        result[zone].total += totalProduit
      })
    })

    // Calculate grand total
    result.total = zones.reduce((sum, zone) => sum + result[zone].total, 0)

    return result
  }

  const prepareBudgetParPeriode = (data) => {
    const periodes = ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"]
    const zones = ["maroc", "etranger"]
    const produits = ["produit1", "produit2", "produit3"]
    const result = {}

    periodes.forEach((periode, index) => {
      const trimestre = `trimestre${index + 1}`
      result[periode] = {
        total: 0,
        zones: {},
      }

      zones.forEach((zone) => {
        result[periode].zones[zone] = {
          total: 0,
          produits: {},
        }

        produits.forEach((produit) => {
          const ventesZone = data[zone]
          const ventesProduit = ventesZone[produit]
          const quantite = Number(ventesProduit[trimestre])

          result[periode].zones[zone].produits[produit] = quantite
          result[periode].zones[zone].total += quantite
          result[periode].total += quantite
        })
      })
    })

    // Calculate grand total
    result.total = periodes.reduce((sum, periode) => sum + result[periode].total, 0)

    return result
  }

  const prepareBudgetParProduit = (data) => {
    const produits = ["Produit 1", "Produit 2", "Produit 3"]
    const zones = ["maroc", "etranger"]
    const periodes = ["trimestre1", "trimestre2", "trimestre3", "trimestre4"]
    const result = {}

    produits.forEach((produit, index) => {
      const produitKey = `produit${index + 1}`
      result[produit] = {
        total: 0,
        zones: {},
      }

      zones.forEach((zone) => {
        result[produit].zones[zone] = {
          total: 0,
          periodes: {},
        }

        periodes.forEach((periode) => {
          const ventesZone = data[zone]
          const ventesProduit = ventesZone[produitKey]
          const quantite = Number(ventesProduit[periode])

          result[produit].zones[zone].periodes[periode] = quantite
          result[produit].zones[zone].total += quantite
          result[produit].total += quantite
        })
      })
    })

    // Calculate grand total
    result.total = produits.reduce((sum, produit) => sum + result[produit].total, 0)

    return result
  }

  const prepareBudgetGlobal = (data) => {
    const produits = ["Produit 1", "Produit 2", "Produit 3"]
    const zones = ["maroc", "etranger"]
    const periodes = ["trimestre1", "trimestre2", "trimestre3", "trimestre4"]
    const result = {
      total: 0,
      produits: {},
      zones: {},
      periodes: {},
    }

    // Initialize structures
    produits.forEach((produit, index) => {
      result.produits[produit] = 0
    })

    zones.forEach((zone) => {
      result.zones[zone] = 0
    })

    periodes.forEach((periode) => {
      result.periodes[periode] = 0
    })

    // Fill data
    produits.forEach((produit, index) => {
      const produitKey = `produit${index + 1}`

      zones.forEach((zone) => {
        periodes.forEach((periode) => {
          const ventesZone = data[zone]
          const ventesProduit = ventesZone[produitKey]
          const quantite = Number(ventesProduit[periode])

          result.produits[produit] += quantite
          result.zones[zone] += quantite
          result.periodes[periode] += quantite
          result.total += quantite
        })
      })
    })

    return result
  }

  const prepareChartDataZone = (budgetParZone) => {
    if (!budgetParZone) return []

    return Object.entries(budgetParZone)
      .filter(([key]) => key !== "total")
      .map(([zone, data]) => ({
        name: zone,
        value: data.total,
      }))
  }

  const prepareChartDataPeriode = (budgetParPeriode) => {
    if (!budgetParPeriode) return []

    return Object.entries(budgetParPeriode)
      .filter(([key]) => key !== "total")
      .map(([periode, data]) => ({
        name: periode,
        value: data.total,
      }))
  }

  const prepareChartDataProduit = (budgetParProduit) => {
    if (!budgetParProduit) return []

    return Object.entries(budgetParProduit)
      .filter(([key]) => key !== "total")
      .map(([produit, data]) => ({
        name: produit,
        value: data.total,
      }))
  }

  const formatNumber = (value, decimals = 0) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  const formatPercentage = (value, total, decimals = 1) => {
    if (!total) return "0%"
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / total)
  }

  const handleExportExcel = () => {
    // Simulate Excel export
    console.log("Exporting to Excel")
    alert("Export Excel simulé. Cette fonctionnalité serait implémentée avec une bibliothèque comme ExcelJS.")
  }

  const handleExportPDF = () => {
    // Simulate PDF export
    console.log("Exporting to PDF")
    alert("Export PDF simulé. Cette fonctionnalité serait implémentée avec une bibliothèque comme jsPDF.")
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  if (!data || dataType !== "budget") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget des ventes</CardTitle>
          <CardDescription>Veuillez importer des données de budget des ventes pour commencer</CardDescription>
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
            <CardTitle>Budget des ventes</CardTitle>
            <CardDescription>
              {data.company} - Présentation du budget des ventes selon différentes ventilations
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
          <Tabs defaultValue="zone">
            <TabsList className="mb-4">
              <TabsTrigger value="zone">Par zone géographique</TabsTrigger>
              <TabsTrigger value="periode">Par période</TabsTrigger>
              <TabsTrigger value="produit">Par produit</TabsTrigger>
              <TabsTrigger value="global">Budget global</TabsTrigger>
            </TabsList>

            <TabsContent value="zone">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Zone / Produit</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                          <TableHead className="text-right">% du total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgetParZone &&
                          Object.entries(budgetParZone)
                            .filter(([key]) => key !== "total")
                            .map(([zone, data]) => (
                              <>
                                <TableRow key={zone} className="bg-muted/50">
                                  <TableCell className="font-bold">{zone}</TableCell>
                                  <TableCell className="text-right font-bold">{formatNumber(data.total)}</TableCell>
                                  <TableCell className="text-right font-bold">
                                    {formatPercentage(data.total, budgetParZone.total)}
                                  </TableCell>
                                </TableRow>
                                {Object.entries(data.produits).map(([produit, quantite]) => (
                                  <TableRow key={`${zone}-${produit}`}>
                                    <TableCell className="pl-6">{produit}</TableCell>
                                    <TableCell className="text-right">{formatNumber(quantite)}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPercentage(quantite, budgetParZone.total)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            ))}
                        <TableRow className="bg-muted">
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">{formatNumber(budgetParZone?.total)}</TableCell>
                          <TableCell className="text-right font-bold">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="h-[400px] flex items-center justify-center">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Quantité",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartDataZone}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartDataZone.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="periode">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Période</TableHead>
                          <TableHead className="text-right">Maroc</TableHead>
                          <TableHead className="text-right">Étranger</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">% du total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgetParPeriode &&
                          Object.entries(budgetParPeriode)
                            .filter(([key]) => key !== "total")
                            .map(([periode, data]) => (
                              <TableRow key={periode}>
                                <TableCell className="font-medium">{periode}</TableCell>
                                <TableCell className="text-right">{formatNumber(data.zones.maroc.total)}</TableCell>
                                <TableCell className="text-right">{formatNumber(data.zones.etranger.total)}</TableCell>
                                <TableCell className="text-right font-medium">{formatNumber(data.total)}</TableCell>
                                <TableCell className="text-right">
                                  {formatPercentage(data.total, budgetParPeriode.total)}
                                </TableCell>
                              </TableRow>
                            ))}
                        <TableRow className="bg-muted">
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(
                              budgetParPeriode &&
                                Object.values(budgetParPeriode)
                                  .filter((item) => typeof item === "object" && item.zones)
                                  .reduce((sum, item) => sum + item.zones.maroc.total, 0),
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(
                              budgetParPeriode &&
                                Object.values(budgetParPeriode)
                                  .filter((item) => typeof item === "object" && item.zones)
                                  .reduce((sum, item) => sum + item.zones.etranger.total, 0),
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(budgetParPeriode?.total)}
                          </TableCell>
                          <TableCell className="text-right font-bold">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Quantité",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataPeriode} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="value" fill="var(--color-value)" name="Quantité" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="produit">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead className="text-right">Maroc</TableHead>
                          <TableHead className="text-right">Étranger</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">% du total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {budgetParProduit &&
                          Object.entries(budgetParProduit)
                            .filter(([key]) => key !== "total")
                            .map(([produit, data]) => (
                              <TableRow key={produit}>
                                <TableCell className="font-medium">{produit}</TableCell>
                                <TableCell className="text-right">{formatNumber(data.zones.maroc.total)}</TableCell>
                                <TableCell className="text-right">{formatNumber(data.zones.etranger.total)}</TableCell>
                                <TableCell className="text-right font-medium">{formatNumber(data.total)}</TableCell>
                                <TableCell className="text-right">
                                  {formatPercentage(data.total, budgetParProduit.total)}
                                </TableCell>
                              </TableRow>
                            ))}
                        <TableRow className="bg-muted">
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(
                              budgetParProduit &&
                                Object.values(budgetParProduit)
                                  .filter((item) => typeof item === "object" && item.zones)
                                  .reduce((sum, item) => sum + item.zones.maroc.total, 0),
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(
                              budgetParProduit &&
                                Object.values(budgetParProduit)
                                  .filter((item) => typeof item === "object" && item.zones)
                                  .reduce((sum, item) => sum + item.zones.etranger.total, 0),
                            )}
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {formatNumber(budgetParProduit?.total)}
                          </TableCell>
                          <TableCell className="text-right font-bold">100%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="h-[400px] flex items-center justify-center">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Quantité",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartDataProduit}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartDataProduit.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="global">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget global des ventes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">Par zone géographique</h3>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Zone</TableHead>
                                <TableHead className="text-right">Quantité</TableHead>
                                <TableHead className="text-right">%</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {budgetGlobal &&
                                Object.entries(budgetGlobal.zones).map(([zone, quantite]) => (
                                  <TableRow key={zone}>
                                    <TableCell className="font-medium">
                                      {zone === "maroc" ? "Maroc" : "Étranger"}
                                    </TableCell>
                                    <TableCell className="text-right">{formatNumber(quantite)}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPercentage(quantite, budgetGlobal.total)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              <TableRow className="bg-muted">
                                <TableCell className="font-bold">Total</TableCell>
                                <TableCell className="text-right font-bold">
                                  {formatNumber(budgetGlobal?.total)}
                                </TableCell>
                                <TableCell className="text-right font-bold">100%</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Par période</h3>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Période</TableHead>
                                <TableHead className="text-right">Quantité</TableHead>
                                <TableHead className="text-right">%</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {budgetGlobal &&
                                Object.entries(budgetGlobal.periodes).map(([periode, quantite], index) => (
                                  <TableRow key={periode}>
                                    <TableCell className="font-medium">Trimestre {index + 1}</TableCell>
                                    <TableCell className="text-right">{formatNumber(quantite)}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPercentage(quantite, budgetGlobal.total)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              <TableRow className="bg-muted">
                                <TableCell className="font-bold">Total</TableCell>
                                <TableCell className="text-right font-bold">
                                  {formatNumber(budgetGlobal?.total)}
                                </TableCell>
                                <TableCell className="text-right font-bold">100%</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">Par produit</h3>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Produit</TableHead>
                                <TableHead className="text-right">Quantité</TableHead>
                                <TableHead className="text-right">%</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {budgetGlobal &&
                                Object.entries(budgetGlobal.produits).map(([produit, quantite]) => (
                                  <TableRow key={produit}>
                                    <TableCell className="font-medium">{produit}</TableCell>
                                    <TableCell className="text-right">{formatNumber(quantite)}</TableCell>
                                    <TableCell className="text-right">
                                      {formatPercentage(quantite, budgetGlobal.total)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              <TableRow className="bg-muted">
                                <TableCell className="font-bold">Total</TableCell>
                                <TableCell className="text-right font-bold">
                                  {formatNumber(budgetGlobal?.total)}
                                </TableCell>
                                <TableCell className="text-right font-bold">100%</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par zone</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Quantité",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartDataZone}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {chartDataZone.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par produit</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Quantité",
                            color: "hsl(var(--chart-3))",
                          },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartDataProduit}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {chartDataProduit.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
