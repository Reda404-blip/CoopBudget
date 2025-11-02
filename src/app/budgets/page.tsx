import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetCreationForm } from "@/components/budgets/budget-creation-form"
import { BudgetList } from "@/components/budgets/budget-list"

export default function BudgetsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Élaboration des budgets</h1>
        <p className="text-muted-foreground">Créez et gérez les différents types de budgets pour votre coopérative</p>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Créer un budget</TabsTrigger>
          <TabsTrigger value="list">Liste des budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Création d'un nouveau budget</CardTitle>
              <CardDescription>Définissez les paramètres de votre nouveau budget</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetCreationForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budgets existants</CardTitle>
              <CardDescription>Consultez et gérez vos budgets existants</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
