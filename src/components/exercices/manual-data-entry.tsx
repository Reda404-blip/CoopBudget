"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"
import type { ExerciceData } from "@/types/exercices"

interface ManualDataEntryProps {
  exerciceId: string
  onDataImported: (data: ExerciceData) => void
}

export function ManualDataEntry({ exerciceId, onDataImported }: ManualDataEntryProps) {
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [fields, setFields] = useState<Array<{ id: string; label: string; type: string }>>([])

  useEffect(() => {
    // Définir les champs en fonction de l'exercice
    switch (exerciceId) {
      case "atlas-produit-a":
        setFields([
          { id: "quantitePrevue", label: "Quantité prévue", type: "number" },
          { id: "prixPrevu", label: "Prix prévu", type: "number" },
          { id: "quantiteRealisee", label: "Quantité réalisée", type: "number" },
          { id: "prixRealise", label: "Prix réalisé", type: "number" },
          { id: "coutStandard", label: "Coût standard", type: "number" },
        ])
        break
      case "britools-prix":
        setFields([
          { id: "prixActuel", label: "Prix actuel", type: "number" },
          { id: "quantiteActuelle", label: "Quantité actuelle", type: "number" },
          { id: "elasticite", label: "Élasticité-prix", type: "number" },
          { id: "coutVariable", label: "Coût variable unitaire", type: "number" },
          { id: "coutFixe", label: "Coûts fixes totaux", type: "number" },
        ])
        break
      case "ecopack-budget":
        setFields([
          { id: "budgetVentes", label: "Budget des ventes actuel", type: "number" },
          { id: "prixMoyen", label: "Prix moyen unitaire", type: "number" },
          { id: "tauxCroissance", label: "Taux de croissance prévu", type: "number" },
          { id: "margeBrute", label: "Marge brute", type: "number" },
        ])
        break
      default:
        setFields([])
        break
    }

    // Réinitialiser le formulaire
    setFormData({})
    setIsSubmitted(false)
  }, [exerciceId])

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    setIsSubmitted(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Convertir les valeurs en nombres si nécessaire
    const processedData: Record<string, any> = {}
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && !isNaN(Number(value))) {
        processedData[key] = Number(value)
      } else {
        processedData[key] = value
      }
    })

    onDataImported(processedData as ExerciceData)
    setIsSubmitted(true)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required
                step={field.type === "number" ? "any" : undefined}
                min={field.type === "number" ? "0" : undefined}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="submit" disabled={isSubmitted || Object.keys(formData).length === 0} className="w-full">
              {isSubmitted ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Données enregistrées
                </>
              ) : (
                "Enregistrer les données"
              )}
            </Button>
          </div>

          {isSubmitted && (
            <div className="flex justify-end mt-4">
              <Button
                variant="default"
                onClick={() => {
                  // Convertir les valeurs en nombres si nécessaire
                  const processedData: Record<string, any> = {}
                  Object.entries(formData).forEach(([key, value]) => {
                    if (typeof value === "string" && !isNaN(Number(value))) {
                      processedData[key] = Number(value)
                    } else {
                      processedData[key] = value
                    }
                  })
                  onDataImported(processedData as ExerciceData)
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continuer vers l'analyse
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
