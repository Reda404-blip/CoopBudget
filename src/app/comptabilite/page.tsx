import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountingEntryForm } from "@/components/accounting/accounting-entry-form"
import { AccountingJournal } from "@/components/accounting/accounting-journal"
import { AccountingReports } from "@/components/accounting/accounting-reports"
import { SectionLoading } from "@/components/accounting/section-loading"
import { Suspense } from "react"

export default function AccountingPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comptabilité analytique</h1>
        <p className="text-muted-foreground">
          Enregistrez et analysez les charges et produits selon le Plan Comptable Général
        </p>
      </div>

      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entry">Saisie comptable</TabsTrigger>
          <TabsTrigger value="journal">Journal comptable</TabsTrigger>
          <TabsTrigger value="reports">Rapports analytiques</TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saisie des charges et produits</CardTitle>
              <CardDescription>Enregistrez les opérations comptables analytiques</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <SectionLoading
                    title="Chargement du formulaire de saisie"
                    description="Préparation des comptes et des axes analytiques..."
                  />
                }
              >
                <AccountingEntryForm />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Journal comptable</CardTitle>
              <CardDescription>Consultez l'historique des opérations comptables</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <SectionLoading
                    title="Chargement du journal"
                    description="Récupération des écritures comptables..."
                  />
                }
              >
                <AccountingJournal />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports analytiques</CardTitle>
              <CardDescription>Analysez la répartition des charges et produits</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <SectionLoading
                    title="Génération des rapports"
                    description="Analyse des données financières en cours..."
                  />
                }
              >
                <AccountingReports />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
