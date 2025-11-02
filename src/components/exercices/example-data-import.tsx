"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import type { ExerciceData } from "@/types/exercices"

interface ExampleDataImportProps {
  exerciceId: string
  onDataImported: (data: ExerciceData) => void
}

export function ExampleDataImport({ exerciceId, onDataImported }: ExampleDataImportProps) {
  const [selectedExample, setSelectedExample] = useState<string | null>(null)
  const [isImported, setIsImported] = useState(false)

  // Exemples de données pour chaque exercice
  const exampleData: Record<string, Record<string, ExerciceData>> = {
    "atlas-produit-a": {
      "Exemple 1 - Produit standard": {
        quantitePrevue: 1000,
        prixPrevu: 50,
        quantiteRealisee: 1200,
        prixRealise: 48,
        coutStandard: 30,
      },
      "Exemple 2 - Produit de luxe": {
        quantitePrevue: 500,
        prixPrevu: 120,
        quantiteRealisee: 450,
        prixRealise: 125,
        coutStandard: 70,
      },
    },
    "britools-prix": {
      "Exemple 1 - Outil à main": {
        prixActuel: 25,
        quantiteActuelle: 5000,
        elasticite: 1.5,
        coutVariable: 12,
        coutFixe: 50000,
      },
      "Exemple 2 - Outil électrique": {
        prixActuel: 89,
        quantiteActuelle: 2000,
        elasticite: 1.2,
        coutVariable: 45,
        coutFixe: 75000,
      },
    },
    "ecopack-budget": {
      "Exemple 1 - Emballage standard": {
        budgetVentes: 500000,
        prixMoyen: 2.5,
        tauxCroissance: 0.08,
        margeBrute: 0.35,
      },
      "Exemple 2 - Emballage premium": {
        budgetVentes: 300000,
        prixMoyen: 4.75,
        tauxCroissance: 0.12,
        margeBrute: 0.45,
      },
    },
  }

  // Obtenir les exemples pour l'exercice actuel
  const examples = exampleData[exerciceId] || {}
  const exampleNames = Object.keys(examples)

  const handleSelectExample = (exampleName: string) => {
    setSelectedExample(exampleName)
    setIsImported(false)
  }

  const handleImport = () => {
    if (selectedExample && examples[selectedExample]) {
      onDataImported(examples[selectedExample])
      setIsImported(true)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exampleNames.length > 0 ? (
          exampleNames.map((exampleName) => (
            <Card
              key={exampleName}
              className={`cursor-pointer transition-all ${
                selectedExample === exampleName ? "border-blue-500 ring-2 ring-blue-200" : "hover:border-gray-300"
              }`}
              onClick={() => handleSelectExample(exampleName)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{exampleName}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {Object.entries(examples[exampleName] || {}).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-2">
            <CardContent className="py-6 text-center text-gray-500">
              Aucun exemple disponible pour cet exercice.
            </CardContent>
          </Card>
        )}
      </div>

      {selectedExample && (
        <div className="flex justify-end space-x-2">
          <Button onClick={handleImport} disabled={isImported} className="w-full">
            {isImported ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Données importées avec succès
              </>
            ) : (
              "Utiliser cet exemple"
            )}
          </Button>
        </div>
      )}

      {isImported && (
        <div className="flex justify-end mt-4">
          <Button
            variant="default"
            onClick={() => onDataImported(examples[selectedExample as string])}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Continuer vers l'analyse
          </Button>
        </div>
      )}
    </div>
  )
}
