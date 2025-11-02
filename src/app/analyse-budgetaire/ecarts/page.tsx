import type { Metadata } from "next"
import { VarianceAnalysisEnhanced } from "@/components/analyse-budgetaire/variance-analysis-enhanced"

export const metadata: Metadata = {
  title: "Analyse des écarts | Analyse Budgétaire",
  description: "Analysez les écarts entre les valeurs budgétées et réalisées",
}

export default function EcartsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analyse des écarts</h1>
        <p className="text-muted-foreground">
          Comparez les valeurs budgétées et réalisées pour identifier les écarts significatifs
        </p>
      </div>

      <VarianceAnalysisEnhanced />
    </div>
  )
}
