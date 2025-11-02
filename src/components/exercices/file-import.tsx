"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, X, Check } from "lucide-react"
import type { ExerciceData } from "@/types/exercices"

interface FileImportProps {
  exerciceId: string
  onDataImported: (data: ExerciceData) => void
  defaultStructure?: Record<string, string>
}

export function FileImport({ exerciceId, onDataImported, defaultStructure }: FileImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<any[] | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    parseFile(selectedFile)
  }

  const parseFile = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      // Vérifier le type de fichier
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".txt")) {
        throw new Error("Format de fichier non supporté. Veuillez utiliser un fichier CSV (.csv) ou texte (.txt).")
      }

      // Lire le fichier comme texte
      const text = await readFileAsText(file)

      // Analyser le CSV
      const { headers, data } = parseCSV(text)

      if (data.length === 0) {
        throw new Error("Le fichier ne contient pas de données.")
      }

      // Afficher un aperçu des données
      setPreview(
        data.slice(0, 5).map((row) => {
          const obj: Record<string, string> = {}
          headers.forEach((header, index) => {
            obj[header] = row[index]
          })
          return obj
        }),
      )

      // Transformer les données selon la structure attendue pour l'exercice
      const transformedData = transformData(data, headers, exerciceId)

      // Passer les données au parent
      onDataImported(transformedData)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'importation du fichier.")
      console.error("Erreur d'importation:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(new Error("Erreur de lecture du fichier"))
      reader.readAsText(file)
    })
  }

  const parseCSV = (text: string): { headers: string[]; data: string[][] } => {
    // Diviser par lignes
    const lines = text.split(/\r\n|\n/)

    // Supprimer les lignes vides
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0)

    if (nonEmptyLines.length === 0) {
      throw new Error("Le fichier est vide")
    }

    // Déterminer le séparateur (virgule ou point-virgule)
    const firstLine = nonEmptyLines[0]
    const separator = firstLine.includes(";") ? ";" : ","

    // Extraire les en-têtes
    const headers = nonEmptyLines[0].split(separator).map((h) => h.trim())

    // Extraire les données
    const data = nonEmptyLines.slice(1).map((line) => line.split(separator).map((cell) => cell.trim()))

    return { headers, data }
  }

  const transformData = (data: string[][], headers: string[], exerciceId: string): ExerciceData => {
    // Créer un objet à partir de la première ligne de données
    const rowData: Record<string, string> = {}
    headers.forEach((header, index) => {
      rowData[header.toLowerCase()] = data[0][index]
    })

    // Transformation spécifique selon le type d'exercice
    switch (exerciceId) {
      case "atlas-produit-a":
        return {
          quantitePrevue: Number(rowData.quantiteprevue || 0),
          prixPrevu: Number(rowData.prixprevu || 0),
          quantiteRealisee: Number(rowData.quantiterealisee || 0),
          prixRealise: Number(rowData.prixrealise || 0),
          coutStandard: Number(rowData.coutstandard || 0),
        }

      case "britools-prix":
        return {
          prixActuel: Number(rowData.prixactuel || 0),
          quantiteActuelle: Number(rowData.quantiteactuelle || 0),
          elasticite: Number(rowData.elasticite || 0),
          coutVariable: Number(rowData.coutvariable || 0),
          coutFixe: Number(rowData.coutfixe || 0),
        }

      case "ecopack-budget":
        return {
          budgetVentes: Number(rowData.budgetventes || 0),
          prixMoyen: Number(rowData.prixmoyen || 0),
          tauxCroissance: Number(rowData.tauxcroissance || 0),
          margeBrute: Number(rowData.margebrute || 0),
        }

      // Ajouter d'autres cas selon les exercices
      default:
        // Par défaut, essayer de convertir les valeurs numériques
        const result: Record<string, any> = {}
        Object.entries(rowData).forEach(([key, value]) => {
          const numValue = Number(value)
          result[key] = isNaN(numValue) ? value : numValue
        })
        return result as ExerciceData
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      parseFile(droppedFile)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.txt"
        className="hidden"
        data-testid="file-input"
      />

      {!file ? (
        <Card
          className="border-dashed border-2 cursor-pointer hover:border-blue-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-1">Déposez votre fichier ici ou cliquez pour parcourir</p>
            <p className="text-sm text-gray-500">Formats acceptés: CSV (.csv), Texte (.txt)</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-green-500 mr-2" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleReset} aria-label="Supprimer le fichier">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2">Analyse du fichier en cours...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : preview ? (
              <div className="space-y-2">
                <p className="font-medium">Aperçu des données:</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(preview[0] || {}).map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {preview.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((value: any, colIndex) => (
                            <td key={colIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {value?.toString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm">Données importées avec succès</span>
                </div>
              </div>
            ) : null}
            {preview && !isLoading && !error && (
              <div className="flex justify-end mt-4">
                <Button
                  variant="default"
                  onClick={() => {
                    // Déclencher l'importation des données
                    const data = transformData(
                      Array.isArray(preview) ? [Object.values(preview[0]).map((v) => v.toString())] : [],
                      Object.keys(preview[0] || {}),
                      exerciceId,
                    )
                    onDataImported(data)
                  }}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Continuer vers l'analyse
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
