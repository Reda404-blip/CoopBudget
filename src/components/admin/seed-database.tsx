"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Database, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SeedDatabase() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysesLoading, setAnalysesLoading] = useState(false)
  const [analysesSuccess, setAnalysesSuccess] = useState(false)
  const [analysesError, setAnalysesError] = useState<string | null>(null)

  const handleSeedDatabase = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch("/api/seed")
      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.message || "Une erreur est survenue lors de l'initialisation de la base de données.")
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'initialisation de la base de données.")
      console.error("Error seeding database:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedAnalyses = async () => {
    setAnalysesLoading(true)
    setAnalysesSuccess(false)
    setAnalysesError(null)

    try {
      const response = await fetch("/api/seed-analyses")
      const data = await response.json()

      if (response.ok) {
        setAnalysesSuccess(true)
      } else {
        setAnalysesError(data.message || "Une erreur est survenue lors de l'initialisation des analyses.")
      }
    } catch (err) {
      setAnalysesError("Une erreur est survenue lors de l'initialisation des analyses.")
      console.error("Error seeding analyses:", err)
    } finally {
      setAnalysesLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Initialisation de la base de données</CardTitle>
          <CardDescription>
            Initialiser la base de données avec des données de test pour les produits, budgets, coûts et comptes
            comptables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>La base de données a été initialisée avec succès.</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            Cette action va créer des données de test dans votre base de données Supabase. Cela inclut des produits, des
            budgets, des coûts et des écritures comptables.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedDatabase} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className={`mr-2 h-4 w-4 ${loading ? "hidden" : ""}`} />
            {loading ? "Initialisation en cours..." : "Initialiser la base de données"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Initialisation des analyses</CardTitle>
          <CardDescription>
            Initialiser la base de données avec des données de test pour les analyses budgétaires.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysesSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>Les analyses ont été initialisées avec succès.</AlertDescription>
            </Alert>
          )}
          {analysesError && (
            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{analysesError}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground">
            Cette action va créer des analyses de test dans votre base de données Supabase. Cela inclut des analyses
            d'écarts, d'optimisation, de tendances et de distribution.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeedAnalyses} disabled={analysesLoading}>
            {analysesLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className={`mr-2 h-4 w-4 ${analysesLoading ? "hidden" : ""}`} />
            {analysesLoading ? "Initialisation en cours..." : "Initialiser les analyses"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
