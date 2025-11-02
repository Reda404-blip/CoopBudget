"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileSpreadsheet, Table, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ecartsSampleData,
  optimisationPrixSampleData,
  variationPrixSampleData,
  budgetVentesSampleData,
} from "@/lib/sample-data"

export function ImportData({ onDataImported }) {
  const [importMethod, setImportMethod] = useState("upload")
  const [selectedDataType, setSelectedDataType] = useState("")
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError("")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    setFile(droppedFile)
    setError("")
  }

  const handleImport = () => {
    setIsLoading(true)
    setError("")

    // Simulate file processing
    setTimeout(() => {
      setIsLoading(false)

      if (!selectedDataType) {
        setError("Veuillez sélectionner un type d'analyse")
        return
      }

      if (importMethod === "upload" && !file) {
        setError("Veuillez sélectionner un fichier à importer")
        return
      }

      // Use sample data based on the selected type
      let data
      switch (selectedDataType) {
        case "ecarts":
          data = ecartsSampleData
          break
        case "optimisation":
          data = optimisationPrixSampleData
          break
        case "variation":
          data = variationPrixSampleData
          break
        case "budget":
          data = budgetVentesSampleData
          break
        default:
          setError("Type d'analyse non reconnu")
          return
      }

      onDataImported(data, selectedDataType)
    }, 1500)
  }

  const handleUseSample = () => {
    setIsLoading(true)
    setError("")

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)

      if (!selectedDataType) {
        setError("Veuillez sélectionner un type d'analyse")
        return
      }

      // Use sample data based on the selected type
      let data
      switch (selectedDataType) {
        case "ecarts":
          data = ecartsSampleData
          break
        case "optimisation":
          data = optimisationPrixSampleData
          break
        case "variation":
          data = variationPrixSampleData
          break
        case "budget":
          data = budgetVentesSampleData
          break
        default:
          setError("Type d'analyse non reconnu")
          return
      }

      onDataImported(data, selectedDataType)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Label htmlFor="data-type">Type d'analyse</Label>
        <Select value={selectedDataType} onValueChange={setSelectedDataType}>
          <SelectTrigger id="data-type">
            <SelectValue placeholder="Sélectionnez le type d'analyse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ecarts">Analyse des écarts (ATLAS, Applications 03/04)</SelectItem>
            <SelectItem value="optimisation">Optimisation des prix (BRITOOLS)</SelectItem>
            <SelectItem value="variation">Impact des variations de prix (TEXTLUXE)</SelectItem>
            <SelectItem value="budget">Budget des ventes (Aliments DHM)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={importMethod} onValueChange={setImportMethod}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Importer un fichier</TabsTrigger>
          <TabsTrigger value="sample">Utiliser un exemple</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Glissez-déposez votre fichier ici</h3>
                <p className="text-sm text-muted-foreground mb-2">ou cliquez pour sélectionner un fichier</p>
                <p className="text-xs text-muted-foreground">Formats supportés: CSV, XLSX, XLS</p>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {file && (
                <div className="mt-4 p-3 bg-muted rounded-md flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sample" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Table className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="font-medium">Utiliser les données d'exemple</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilisez nos données prédéfinies pour tester les fonctionnalités d'analyse
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3">
        {importMethod === "upload" ? (
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? "Importation..." : "Importer et analyser"}
          </Button>
        ) : (
          <Button onClick={handleUseSample} disabled={isLoading}>
            {isLoading ? "Chargement..." : "Utiliser et analyser"}
          </Button>
        )}
      </div>
    </div>
  )
}
