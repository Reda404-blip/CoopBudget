import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VarianceAnalysis } from "@/components/analysis/variance-analysis"
import { BudgetPerformance } from "@/components/analysis/budget-performance"

export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analyse des écarts</h1>
        <p className="text-muted-foreground">
          Comparez les budgets prévus avec les résultats réels et analysez les écarts
        </p>
      </div>

      <Tabs defaultValue="variance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="variance">Analyse des écarts</TabsTrigger>
          <TabsTrigger value="performance">Performance budgétaire</TabsTrigger>
        </TabsList>

        <TabsContent value="variance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Écarts budgétaires</CardTitle>
              <CardDescription>Analyse détaillée des écarts entre prévisions et réalisations</CardDescription>
            </CardHeader>
            <CardContent>
              <VarianceAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance budgétaire</CardTitle>
              <CardDescription>Évaluation de la performance des différents budgets</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetPerformance />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
