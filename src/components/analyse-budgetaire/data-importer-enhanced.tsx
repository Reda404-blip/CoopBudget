"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  ArrowRight,
  Check,
  Database,
  FileSpreadsheet,
  FileUp,
  HelpCircle,
  TableIcon,
  Upload,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function DataImporterEnhanced() {
  const router = useRouter()
  const [importMethod, setImportMethod] = useState("upload")
  const [dataType, setDataType] = useState("budget")
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [csvData, setCsvData] = useState("")
  const [hasHeaders, setHasHeaders] = useState(true)
  const [delimiter, setDelimiter] = useState(",")
  const [previewData, setPreviewData] = useState(null)
  const [dataStructure, setDataStructure] = useState(null)
  const [step, setStep] = useState(1)

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

      // Detect data structure
      if (tableHeaders.length > 0 && tableData.length > 0) {
        const structure = detectDataStructure({
          headers: tableHeaders,
          data: tableData,
        })
        setDataStructure(structure)
      }
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
        role: guessColumnRole(header, detectColumnType(data.data, index)),
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

  const guessColumnRole = (header, type) => {
    const headerLower = header.toLowerCase()

    // Try to guess the role based on the header name and type
    if (type === "number") {
      if (headerLower.includes("prix") || headerLower.includes("tarif")) {
        return "price"
      } else if (headerLower.includes("quantité") || headerLower.includes("qté") || headerLower.includes("volume")) {
        return "quantity"
      } else if (headerLower.includes("coût") || headerLower.includes("cout") || headerLower.includes("charge")) {
        return "cost"
      } else if (headerLower.includes("budget") || headerLower.includes("prévision") || headerLower.includes("prévu")) {
        return "budget"
      } else if (headerLower.includes("réel") || headerLower.includes("réalisé") || headerLower.includes("actuel")) {
        return "actual"
      } else if (headerLower.includes("montant") || headerLower.includes("total") || headerLower.includes("somme")) {
        return "amount"
      }
    } else if (type === "date") {
      return "date"
    } else if (type === "text") {
      if (headerLower.includes("produit") || headerLower.includes("article") || headerLower.includes("item")) {
        return "product"
      } else if (
        headerLower.includes("catégorie") ||
        headerLower.includes("categorie") ||
        headerLower.includes("type")
      ) {
        return "category"
      } else if (headerLower.includes("région") || headerLower.includes("region") || headerLower.includes("zone")) {
        return "region"
      }
    }

    return "unknown"
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "price":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "quantity":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cost":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "budget":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "actual":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "amount":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "date":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
      case "product":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
      case "category":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
      case "region":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
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

        // Move to next step
        setStep(2)
        setIsLoading(false)
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors de l'importation")
        setIsLoading(false)
      }
    }, 2000)
  }

  const handleConfirmStructure = () => {
    setStep(3)
    // In a real app, we would save the data structure to the server or state management

    // Simulate processing
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/analyse-budgetaire/ecarts")
    }, 1500)
  }

  const getSampleData = () => {
    // Return sample data based on the selected type
    if (dataType === "budget") {
      return {
        headers: ["Date", "Produit", "Catégorie", "Budget", "Réel", "Écart"],
        data: [
          ["2023-01-15", "Produit A", "Catégorie 1", "1000", "950", "-50"],
          ["2023-01-22", "Produit B", "Catégorie 2", "1200", "1150", "-50"],
          ["2023-02-05", "Produit A", "Catégorie 1", "900", "1100", "200"],
          ["2023-02-18", "Produit C", "Catégorie 3", "1500", "1700", "200"],
          ["2023-03-10", "Produit B", "Catégorie 2", "1800", "1900", "100"],
        ],
      }
    } else if (dataType === "price") {
      return {
        headers: ["Produit", "Prix", "Coût", "Quantité", "Marge"],
        data: [
          ["Produit A", "25.50", "15.30", "120", "10.20"],
          ["Produit B", "32.75", "19.65", "85", "13.10"],
          ["Produit C", "18.25", "10.95", "200", "7.30"],
          ["Produit D", "45.00", "27.00", "50", "18.00"],
          ["Produit E", "12.99", "7.79", "300", "5.20"],
        ],
      }
    } else {
      return {
        headers: ["Date", "Région", "Produit", "Ventes", "Objectif", "Performance"],
        data: [
          ["2023-01", "Nord", "Produit A", "12500", "12000", "104%"],
          ["2023-01", "Sud", "Produit A", "9800", "10000", "98%"],
          ["2023-01", "Est", "Produit B", "8500", "8000", "106%"],
          ["2023-01", "Ouest", "Produit B", "11200", "12000", "93%"],
          ["2023-02", "Nord", "Produit A", "13100", "12500", "105%"],
        ],
      }
    }
  }

  return (
    <div className="space-y-8">
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Importation des données</CardTitle>
            <CardDescription>Importez vos données budgétaires pour commencer l'analyse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={importMethod} onValueChange={setImportMethod}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileUp className="h-4 w-4" />
                  <span>Importer un fichier</span>
                </TabsTrigger>
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <TableIcon className="h-4 w-4" />
                  <span>Coller des données</span>
                </TabsTrigger>
                <TabsTrigger value="sample" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Utiliser un exemple</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4 pt-4">
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
                    <Badge variant="outline" className="ml-2">
                      {file.type || "text/csv"}
                    </Badge>
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
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted">
                              {previewData.headers.map((header, index) => (
                                <TableHead
                                  key={index}
                                  className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                                >
                                  {header}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {previewData.data.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell key={cellIndex} className="px-4 py-2 text-sm">
                                    {cell}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="paste" className="space-y-4 pt-4">
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
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted">
                            {previewData.headers.map((header, index) => (
                              <TableHead
                                key={index}
                                className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                              >
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} className="px-4 py-2 text-sm">
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sample" className="space-y-4 pt-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Database className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-medium">Utiliser les données d'exemple</h3>
                    <p className="text-sm text-muted-foreground">
                      Utilisez nos données prédéfinies pour tester les fonctionnalités d'analyse
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-type">Type de données</Label>
                  <Select value={dataType} onValueChange={setDataType}>
                    <SelectTrigger id="data-type">
                      <SelectValue placeholder="Sélectionnez un type de données" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Données budgétaires</SelectItem>
                      <SelectItem value="price">Données de prix et coûts</SelectItem>
                      <SelectItem value="sales">Données de ventes par région</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted">
                          {getSampleData().headers.map((header, index) => (
                            <TableHead
                              key={index}
                              className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getSampleData().data.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <TableCell key={cellIndex} className="px-4 py-2 text-sm">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/analyse-budgetaire")}>
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={isLoading}>
              {isLoading ? (
                <>
                  <FileUp className="mr-2 h-4 w-4 animate-pulse" />
                  Importation...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continuer
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && dataStructure && (
        <Card>
          <CardHeader>
            <CardTitle>Vérification de la structure des données</CardTitle>
            <CardDescription>Vérifiez et confirmez la structure détectée de vos données</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Structure détectée</h3>
                <Badge variant="outline" className="ml-2">
                  {dataStructure.rowCount} lignes
                </Badge>
              </div>

              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead className="w-[180px]">Colonne</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rôle détecté</TableHead>
                        <TableHead>Exemple</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataStructure.columns.map((column, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{column.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {column.type === "number" ? "Nombre" : column.type === "date" ? "Date" : "Texte"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(column.role)}>
                              {column.role === "price"
                                ? "Prix"
                                : column.role === "quantity"
                                  ? "Quantité"
                                  : column.role === "cost"
                                    ? "Coût"
                                    : column.role === "budget"
                                      ? "Budget"
                                      : column.role === "actual"
                                        ? "Réel"
                                        : column.role === "amount"
                                          ? "Montant"
                                          : column.role === "date"
                                            ? "Date"
                                            : column.role === "product"
                                              ? "Produit"
                                              : column.role === "category"
                                                ? "Catégorie"
                                                : column.role === "region"
                                                  ? "Région"
                                                  : "Inconnu"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {dataStructure.sampleData[0] ? dataStructure.sampleData[0][column.index] : ""}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="help">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span>Comment fonctionne la détection automatique ?</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>Notre système analyse automatiquement vos données pour détecter :</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Le type de chaque colonne (nombre, date, texte)</li>
                      <li>Le rôle probable de chaque colonne (prix, quantité, produit, etc.)</li>
                      <li>La structure globale des données</li>
                    </ul>
                    <p>Vous pouvez modifier ces détections si nécessaire avant de continuer.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {isLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Traitement en cours...</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button onClick={handleConfirmStructure} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Check className="mr-2 h-4 w-4 animate-pulse" />
                  Traitement...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmer et continuer
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
