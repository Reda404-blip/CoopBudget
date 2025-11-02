"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, FileUp, LineChart, PieChart, Sliders, ArrowRight, FileSpreadsheet } from "lucide-react"
import { AnalyseBudgetaireStats } from "@/components/analyse-budgetaire/analyse-budgetaire-stats"
import { RecentAnalyses } from "@/components/analyse-budgetaire/recent-analyses"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AnalyseBudgetairePage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get current user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    fetchUser()
  }, [])

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analyse Budgétaire</h1>
        <p className="text-muted-foreground">Analysez vos données budgétaires et obtenez des insights automatisés</p>
      </div>

      <AnalyseBudgetaireStats />

      <Tabs defaultValue="analyses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyses">Analyses récentes</TabsTrigger>
          <TabsTrigger value="modules">Modules d'analyse</TabsTrigger>
        </TabsList>
        <TabsContent value="analyses" className="space-y-4">
          <RecentAnalyses />
        </TabsContent>
        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Importation de données</CardTitle>
                <FileUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Importez vos données depuis différentes sources (CSV, Excel, etc.)
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/importation" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Importer des données</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analyse des écarts</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Comparez les valeurs budgétées et réalisées pour identifier les écarts
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/ecarts" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Analyser les écarts</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Optimisation</CardTitle>
                <Sliders className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Optimisez vos prix, quantités et coûts pour maximiser les résultats
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/optimisation" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Optimiser les paramètres</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analyse de tendances</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Analysez l'évolution de vos indicateurs budgétaires dans le temps
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/tendances" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Analyser les tendances</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analyse de distribution</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Visualisez la répartition de vos données budgétaires par catégories
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/distribution" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Analyser la distribution</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rapports</CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Générez des rapports détaillés à partir de vos analyses
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/analyse-budgetaire/rapports" passHref>
                  <Button variant="outline" size="sm" className="w-full">
                    <span>Générer des rapports</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
