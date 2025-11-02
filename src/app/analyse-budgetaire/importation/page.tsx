import type { Metadata } from "next"
import { DataImporterEnhanced } from "@/components/analyse-budgetaire/data-importer-enhanced"

export const metadata: Metadata = {
  title: "Importation de données | Analyse Budgétaire",
  description: "Importez vos données pour l'analyse budgétaire",
}

export default function ImportationPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Importation de données</h1>
        <p className="text-muted-foreground">Importez vos données budgétaires pour commencer l'analyse</p>
      </div>

      <DataImporterEnhanced />
    </div>
  )
}
