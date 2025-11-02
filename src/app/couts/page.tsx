import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CostEntryForm } from "@/components/costs/cost-entry-form"
import { StandardCostsTable } from "@/components/costs/standard-costs-table"
import { CostAnalysis } from "@/components/costs/cost-analysis"

export default function CostsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Suivi des coûts</h1>
        <p className="text-muted-foreground">Gestion des coûts analytiques et standards pour vos produits</p>
      </div>

      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry">Saisie des coûts</TabsTrigger>
          <TabsTrigger value="standards">Coûts standards</TabsTrigger>
          <TabsTrigger value="analysis">Analyse des coûts</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enregistrement des coûts analytiques</CardTitle>
              <CardDescription>Saisissez les coûts directs et indirects liés à vos produits</CardDescription>
            </CardHeader>
            <CardContent>
              <CostEntryForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coûts standards</CardTitle>
              <CardDescription>Définissez des coûts prévisionnels pour chaque produit</CardDescription>
            </CardHeader>
            <CardContent>
              <StandardCostsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des coûts</CardTitle>
              <CardDescription>Comparaison entre coûts réels et coûts standards</CardDescription>
            </CardHeader>
            <CardContent>
              <CostAnalysis />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
