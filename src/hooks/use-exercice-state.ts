"use client"

import { useState } from "react"
import type { ImportMethod, ExerciceResult } from "@/types/exercices"

export function useExerciceState() {
  const [activeTab, setActiveTab] = useState<string>("import")
  const [selectedImportMethod, setSelectedImportMethod] = useState<ImportMethod>(null)
  const [isAnalysisComplete, setIsAnalysisComplete] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Résultats fictifs pour la démonstration
  const results: ExerciceResult[] = [
    {
      title: "Écart sur prix",
      value: "+75 000 €",
      type: "positive",
      description: "Favorable",
    },
    {
      title: "Écart sur quantité",
      value: "-105 000 €",
      type: "negative",
      description: "Défavorable",
    },
    {
      title: "Écart total",
      value: "-30 000 €",
      type: "negative",
      description: "Défavorable",
    },
  ]

  const handleImportMethodSelect = (method: ImportMethod) => {
    setSelectedImportMethod(method)
    setError(null)
  }

  const handleContinue = () => {
    if (selectedImportMethod) {
      setActiveTab("analyse")
    } else {
      setError("Veuillez sélectionner une méthode d'importation")
    }
  }

  const handleStartAnalysis = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simuler un traitement asynchrone
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsAnalysisComplete(true)
      setActiveTab("resultats")
    } catch (err) {
      setError("Une erreur est survenue lors de l'analyse")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImportMethod(null)
    setIsAnalysisComplete(false)
    setActiveTab("import")
    setError(null)
  }

  return {
    activeTab,
    setActiveTab,
    selectedImportMethod,
    handleImportMethodSelect,
    isAnalysisComplete,
    isLoading,
    error,
    results,
    handleContinue,
    handleStartAnalysis,
    resetAnalysis,
  }
}
