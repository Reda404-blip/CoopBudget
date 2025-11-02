"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileSpreadsheet, AlertCircle, Database, FileUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export function DataImporter({ onDataImported }) {
  const [importMethod, setImportMethod] = useState("upload")
  const [dataType, setDataType] = useState("")
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [csvData, setCsvData] = useState("")
  const [hasHeaders, setHasHeaders] = useState(true)
  const [delimiter, setDelimiter] = useState(",")
  const [previewData, setPreviewData] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError("")

    if (selectedFile) {
      // Preview file contents
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target.result
          setCsvData(content)
          generatePreview(content, delimiter, hasHeaders)
        } catch (err) {
          setError("Erreur lors de la lecture du fichier")
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    setFile(droppedFile)
    setError("")

    if (droppedFile) {
      // Preview file contents
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target.result
          setCsvData(content)
          generatePreview(content, delimiter, hasHeaders)
        } catch (err) {
          setError("Erreur lors de la lecture du fichier")
        }
      }
      reader.readAsText(droppedFile)
    }
  }

  const handleCsvDataChange = (e) => {
    const content = e.target.value
    setCsvData(content)
    generatePreview(content, delimiter, hasHeaders)
  }

  const handleDelimiterChange = (value) => {
    setDelimiter(value)
    generatePreview(csvData, value, hasHeaders)
  }

  const handleHeadersChange = (checked) => {
    setHasHeaders(checked)
    generatePreview(csvData, delimiter, checked)
  }

  const generatePreview = (content, delim, headers) => {
    if (!content) {
      setPreviewData(null)
      return
    }

    try {
      // Split content into lines
      const lines = content.split("\n").filter((line) => line.trim())

      if (lines.length === 0) {
        setPreviewData(null)
        return
      }

      // Parse CSV
      const parsedData = lines.map((line) => line.split(delim).map((cell) => cell.trim()))

      // Extract headers and data
      let tableHeaders = []
      let tableData = []

      if (headers && parsedData.length > 0) {
        tableHeaders = parsedData[0]
        tableData = parsedData.slice(1)
      } else {
        tableData = parsedData
        // Generate default headers (Column 1, Column 2, etc.)
        if (parsedData.length > 0) {
          tableHeaders = Array.from({ length: parsedData[0].length }, (_, i) => `Colonne ${i + 1}`)
        }
      }

      setPreviewData({
        headers: tableHeaders,
        data: tableData.slice(0, 5), // Limit preview to 5 rows
      })
    } catch (err) {
      setError("Erreur lors de l'analyse des données")
      setPreviewData(null)
    }
  }

  const detectDataStructure = (data) => {
    // This function would analyze the data to determine its structure
    // For example, identifying columns that contain dates, numbers, categories, etc.

    // For this example, we'll return a simple structure
    return {
      columns: data.headers.map((header, index) => ({
        name: header,
        index,
        type: detectColumnType(data.data, index),
      })),
      rowCount: data.data.length,
      sampleData: data.data.slice(0, 5),
    }
  }

  const detectColumnType = (data, columnIndex) => {
    // Check a sample of values to determine column type
    const sampleSize = Math.min(data.length, 10)
    const sample = data.slice(0, sampleSize).map((row) => row[columnIndex])

    // Check if all values are numbers
    const allNumbers = sample.every((value) => !isNaN(Number.parseFloat(value)) && isFinite(value))
    if (allNumbers) return "number"

    // Check if values look like dates
    const datePattern = /^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}$/
    const allDates = sample.every((value) => datePattern.test(value))
    if (allDates) return "date"

    // Default to text
    return "text"
  }

  const handleImport = () => {
    setIsLoading(true)
    setProgress(0)
    setError("")

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate processing
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      try {
        if (importMethod === "upload" && !file && !csvData) {
          throw new Error("Aucune donnée à importer")
        }

        let parsedData

        if (importMethod === "upload" || importMethod === "paste") {
          if (!previewData) {
            throw new Error("Impossible d'analyser les données")
          }

          parsedData = {
            headers: previewData.headers,
            data: previewData.data,
          }
        } else if (importMethod === "sample") {
          // Use sample data
          parsedData = getSampleData()
        }

        // Detect data structure
        const structure = detectDataStructure(parsedData)

        // Call the callback with the imported data and its structure
        onDataImported(parsedData, structure)
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors de l'importation")
      } finally {
        setIsLoading(false)
      }
    }, 2000)
  }

  const getSampleData = () => {
    // Return sample data based on the selected type
    return {
      headers: ["Date", "Produit", "Quantité", "Prix", "Montant"],
      data: [
        ["2023-01-15", "Produit A", "120", "25.50", "3060"],
        ["2023-01-22", "Produit B", "85", "32.75", "2783.75"],
        ["2023-02-05", "Produit A", "150", "24.99", "3748.5"],
        ["2023-02-18", "Produit C", "200", "18.25", "3650"],
        ["2023-03-10", "Produit B", "95", "33.50", "3182.5"],
      ],
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importation des données</CardTitle>
        <CardDescription>Importez vos données budgétaires pour commencer l'analyse</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={importMethod} onValueChange={setImportMethod}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Importer un fichier</TabsTrigger>
            <TabsTrigger value="paste">Coller des données</TabsTrigger>
            <TabsTrigger value="sample">Utiliser un exemple</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
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

            {previewData && (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Options d'importation</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delimiter">Délimiteur</Label>
                    <Select value={delimiter} onValueChange={handleDelimiterChange}>
                      <SelectTrigger id="delimiter">
                        <SelectValue placeholder="Sélectionnez un délimiteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=",">Virgule (,)</SelectItem>
                        <SelectItem value=";">Point-virgule (;)</SelectItem>
                        <SelectItem value="\t">Tabulation</SelectItem>
                        <SelectItem value="|">Barre verticale (|)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="headers" checked={hasHeaders} onCheckedChange={handleHeadersChange} />
                    <Label htmlFor="headers">La première ligne contient les en-têtes</Label>
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          {previewData.headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.data.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-t">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-data">Collez vos données (format CSV)</Label>
              <Textarea
                id="csv-data"
                placeholder="Date,Produit,Quantité,Prix,Montant
2023-01-15,Produit A,120,25.50,3060
2023-01-22,Produit B,85,32.75,2783.75"
                className="font-mono text-sm"
                rows={10}
                value={csvData}
                onChange={handleCsvDataChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delimiter-paste">Délimiteur</Label>
                <Select value={delimiter} onValueChange={handleDelimiterChange}>
                  <SelectTrigger id="delimiter-paste">
                    <SelectValue placeholder="Sélectionnez un délimiteur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Virgule (,)</SelectItem>
                    <SelectItem value=";">Point-virgule (;)</SelectItem>
                    <SelectItem value="\t">Tabulation</SelectItem>
                    <SelectItem value="|">Barre verticale (|)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="headers-paste" checked={hasHeaders} onCheckedChange={handleHeadersChange} />
                <Label htmlFor="headers-paste">La première ligne contient les en-têtes</Label>
              </div>
            </div>

            {previewData && (
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        {previewData.headers.map((header, index) => (
                          <th key={index} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sample" className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Database className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">Utiliser les données d'exemple</h3>
                <p className="text-sm text-muted-foreground">
                  Utilisez nos données prédéfinies pour tester les fonctionnalités d'analyse
                </p>
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Produit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Quantité</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Prix</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-sm">2023-01-15</td>
                      <td className="px-4 py-2 text-sm">Produit A</td>
                      <td className="px-4 py-2 text-sm">120</td>
                      <td className="px-4 py-2 text-sm">25.50</td>
                      <td className="px-4 py-2 text-sm">3060</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-sm">2023-01-22</td>
                      <td className="px-4 py-2 text-sm">Produit B</td>
                      <td className="px-4 py-2 text-sm">85</td>
                      <td className="px-4 py-2 text-sm">32.75</td>
                      <td className="px-4 py-2 text-sm">2783.75</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2 text-sm">2023-02-05</td>
                      <td className="px-4 py-2 text-sm">Produit A</td>
                      <td className="px-4 py-2 text-sm">150</td>
                      <td className="px-4 py-2 text-sm">24.99</td>
                      <td className="px-4 py-2 text-sm">3748.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Importation en cours...</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleImport} disabled={isLoading}>
            {isLoading ? (
              <>
                <FileUp className="mr-2 h-4 w-4 animate-pulse" />
                Importation...
              </>
            ) : (
              <>
                <FileUp className="mr-2 h-4 w-4" />
                Importer les données
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
