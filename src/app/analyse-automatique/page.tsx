"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ImportData } from "@/components/analyse/import-data"
import { AnalyseEcarts } from "@/components/analyse/analyse-ecarts"
import { OptimisationPrix } from "@/components/analyse/optimisation-prix"
import { BudgetVentes } from "@/components/analyse/budget-ventes"
import { VariationPrix } from "@/components/analyse/variation-prix"

export default function AnalyseAutomatiquePage() {
  const [activeTab, setActiveTab] = useState("import")
  const [importedData, setImportedData] = useState(null)
  const [dataType, setDataType] = useState("")

  const handleDataImported = (data, type) => {
    setImportedData(data)
    setDataType(type)

    // Automatically switch to the appropriate tab based on data type
    switch (type) {
      case "ecarts":
        setActiveTab("ecarts")
        break
      case "optimisation":
        setActiveTab("optimisation")
        break
      case "variation":
        setActiveTab("variation")
        break
      case "budget":
        setActiveTab("budget")
        break
      default:
        break
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyse Automatique</h1>
        <p className="text-muted-foreground">
          Importez vos données et obtenez instantanément des analyses détaillées et des visualisations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="import">Importation</TabsTrigger>
          <TabsTrigger value="ecarts">Analyse des écarts</TabsTrigger>
          <TabsTrigger value="optimisation">Optimisation des prix</TabsTrigger>
          <TabsTrigger value="variation">Impact des variations</TabsTrigger>
          <TabsTrigger value="budget">Budget des ventes</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importation des données</CardTitle>
              <CardDescription>Importez vos données budgétaires pour commencer l'analyse automatique</CardDescription>
            </CardHeader>
            <CardContent>
              <ImportData onDataImported={handleDataImported} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecarts" className="space-y-4">
          <AnalyseEcarts data={importedData} dataType={dataType} />
        </TabsContent>

        <TabsContent value="optimisation" className="space-y-4">
          <OptimisationPrix data={importedData} dataType={dataType} />
        </TabsContent>

        <TabsContent value="variation" className="space-y-4">
          <VariationPrix data={importedData} dataType={dataType} />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetVentes data={importedData} dataType={dataType} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
