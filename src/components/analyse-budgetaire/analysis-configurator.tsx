"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, Calculator, TrendingUp, BarChart4, PieChart } from "lucide-react"

export function AnalysisConfigurator({ data, structure, onAnalysisConfigured }) {
  const [analysisType, setAnalysisType] = useState("variance")
  const [config, setConfig] = useState({
    type: "variance",
    columns: {},
    parameters: {},
    options: {},
  })

  const handleColumnSelect = (key, value) => {
    setConfig({
      ...config,
      columns: {
        ...config.columns,
        [key]: value,
      },
    })
  }

  const handleParameterChange = (key, value) => {
    setConfig({
      ...config,
      parameters: {
        ...config.parameters,
        [key]: value,
      },
    })
  }

  const handleOptionChange = (key, value) => {
    setConfig({
      ...config,
      options: {
        ...config.options,
        [key]: value,
      },
    })
  }

  const handleAnalysisTypeChange = (type) => {
    setAnalysisType(type)
    setConfig({
      ...config,
      type,
      columns: {},
      parameters: {},
      options: {},
    })
  }

  const handleSubmit = () => {
    onAnalysisConfigured({
      ...config,
      type: analysisType,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration de l'analyse</CardTitle>
        <CardDescription>Configurez les paramètres de votre analyse budgétaire</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Type d'analyse</Label>
          <Tabs value={analysisType} onValueChange={handleAnalysisTypeChange}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="variance" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Analyse des écarts</span>
              </TabsTrigger>
              <TabsTrigger value="optimization" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Optimisation</span>
              </TabsTrigger>
              <TabsTrigger value="distribution" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span>Distribution</span>
              </TabsTrigger>
              <TabsTrigger value="trend" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                <span>Tendance</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="variance" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Configuration de l'analyse des écarts</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="actual-column">Colonne des valeurs réalisées</Label>
                <Select
                  value={config.columns.actual || ""}
                  onValueChange={(value) => handleColumnSelect("actual", value)}
                >
                  <SelectTrigger id="actual-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-column">Colonne des valeurs budgétées</Label>
                <Select
                  value={config.columns.budget || ""}
                  onValueChange={(value) => handleColumnSelect("budget", value)}
                >
                  <SelectTrigger id="budget-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category-column">Colonne de catégorie</Label>
                <Select
                  value={config.columns.category || ""}
                  onValueChange={(value) => handleColumnSelect("category", value)}
                >
                  <SelectTrigger id="category-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "text")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-column">Colonne de date (optionnel)</Label>
                <Select value={config.columns.date || ""} onValueChange={(value) => handleColumnSelect("date", value)}>
                  <SelectTrigger id="date-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {structure.columns
                      .filter((col) => col.type === "date")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options d'analyse</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-percentage"
                    checked={config.options.showPercentage || false}
                    onCheckedChange={(checked) => handleOptionChange("showPercentage", checked)}
                  />
                  <label
                    htmlFor="show-percentage"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Afficher les écarts en pourcentage
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highlight-significant"
                    checked={config.options.highlightSignificant || false}
                    onCheckedChange={(checked) => handleOptionChange("highlightSignificant", checked)}
                  />
                  <label
                    htmlFor="highlight-significant"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mettre en évidence les écarts significatifs
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="calculate-totals"
                    checked={config.options.calculateTotals || false}
                    onCheckedChange={(checked) => handleOptionChange("calculateTotals", checked)}
                  />
                  <label
                    htmlFor="calculate-totals"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Calculer les totaux
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Seuil d'écart significatif (%)</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="10"
                value={config.parameters.threshold || ""}
                onChange={(e) => handleParameterChange("threshold", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Configuration de l'optimisation</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price-column">Colonne des prix</Label>
                <Select
                  value={config.columns.price || ""}
                  onValueChange={(value) => handleColumnSelect("price", value)}
                >
                  <SelectTrigger id="price-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity-column">Colonne des quantités</Label>
                <Select
                  value={config.columns.quantity || ""}
                  onValueChange={(value) => handleColumnSelect("quantity", value)}
                >
                  <SelectTrigger id="quantity-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost-column">Colonne des coûts</Label>
                <Select value={config.columns.cost || ""} onValueChange={(value) => handleColumnSelect("cost", value)}>
                  <SelectTrigger id="cost-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-column">Colonne des produits</Label>
                <Select
                  value={config.columns.product || ""}
                  onValueChange={(value) => handleColumnSelect("product", value)}
                >
                  <SelectTrigger id="product-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "text")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="elasticity">Élasticité-prix (si connue)</Label>
              <Input
                id="elasticity"
                type="number"
                step="0.1"
                placeholder="-1.5"
                value={config.parameters.elasticity || ""}
                onChange={(e) => handleParameterChange("elasticity", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixed-costs">Coûts fixes (si connus)</Label>
              <Input
                id="fixed-costs"
                type="number"
                placeholder="10000"
                value={config.parameters.fixedCosts || ""}
                onChange={(e) => handleParameterChange("fixedCosts", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Objectif d'optimisation</Label>
              <RadioGroup
                value={config.parameters.objective || "profit"}
                onValueChange={(value) => handleParameterChange("objective", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="profit" id="profit" />
                  <Label htmlFor="profit">Maximiser le bénéfice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="revenue" id="revenue" />
                  <Label htmlFor="revenue">Maximiser le chiffre d'affaires</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quantity" id="quantity" />
                  <Label htmlFor="quantity">Maximiser la quantité vendue</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Configuration de l'analyse de distribution</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value-column">Colonne des valeurs</Label>
                <Select
                  value={config.columns.value || ""}
                  onValueChange={(value) => handleColumnSelect("value", value)}
                >
                  <SelectTrigger id="value-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-column-dist">Colonne de catégorie</Label>
                <Select
                  value={config.columns.categoryDist || ""}
                  onValueChange={(value) => handleColumnSelect("categoryDist", value)}
                >
                  <SelectTrigger id="category-column-dist">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "text")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-category">Colonne de catégorie secondaire (optionnel)</Label>
              <Select
                value={config.columns.secondaryCategory || ""}
                onValueChange={(value) => handleColumnSelect("secondaryCategory", value)}
              >
                <SelectTrigger id="secondary-category">
                  <SelectValue placeholder="Sélectionnez une colonne" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune</SelectItem>
                  {structure.columns
                    .filter((col) => col.type === "text")
                    .map((column, index) => (
                      <SelectItem key={index} value={column.index.toString()}>
                        {column.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Options de visualisation</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-percentages"
                    checked={config.options.showPercentages || false}
                    onCheckedChange={(checked) => handleOptionChange("showPercentages", checked)}
                  />
                  <label
                    htmlFor="show-percentages"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Afficher les pourcentages
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sort-by-value"
                    checked={config.options.sortByValue || false}
                    onCheckedChange={(checked) => handleOptionChange("sortByValue", checked)}
                  />
                  <label
                    htmlFor="sort-by-value"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Trier par valeur
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="group-small-values"
                    checked={config.options.groupSmallValues || false}
                    onCheckedChange={(checked) => handleOptionChange("groupSmallValues", checked)}
                  />
                  <label
                    htmlFor="group-small-values"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Regrouper les petites valeurs
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="small-value-threshold">Seuil pour les petites valeurs (%)</Label>
              <Input
                id="small-value-threshold"
                type="number"
                placeholder="5"
                value={config.parameters.smallValueThreshold || ""}
                onChange={(e) => handleParameterChange("smallValueThreshold", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trend" className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Configuration de l'analyse de tendance</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-column">Colonne temporelle</Label>
                <Select value={config.columns.time || ""} onValueChange={(value) => handleColumnSelect("time", value)}>
                  <SelectTrigger id="time-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns.map((column, index) => (
                      <SelectItem key={index} value={column.index.toString()}>
                        {column.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metric-column">Colonne de métrique</Label>
                <Select
                  value={config.columns.metric || ""}
                  onValueChange={(value) => handleColumnSelect("metric", value)}
                >
                  <SelectTrigger id="metric-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="segment-column">Colonne de segmentation (optionnel)</Label>
                <Select
                  value={config.columns.segment || ""}
                  onValueChange={(value) => handleColumnSelect("segment", value)}
                >
                  <SelectTrigger id="segment-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune</SelectItem>
                    {structure.columns
                      .filter((col) => col.type === "text")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comparison-column">Colonne de comparaison (optionnel)</Label>
                <Select
                  value={config.columns.comparison || ""}
                  onValueChange={(value) => handleColumnSelect("comparison", value)}
                >
                  <SelectTrigger id="comparison-column">
                    <SelectValue placeholder="Sélectionnez une colonne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune</SelectItem>
                    {structure.columns
                      .filter((col) => col.type === "number")
                      .map((column, index) => (
                        <SelectItem key={index} value={column.index.toString()}>
                          {column.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Options d'analyse</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-trend-line"
                    checked={config.options.showTrendLine || false}
                    onCheckedChange={(checked) => handleOptionChange("showTrendLine", checked)}
                  />
                  <label
                    htmlFor="show-trend-line"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Afficher la ligne de tendance
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-forecast"
                    checked={config.options.showForecast || false}
                    onCheckedChange={(checked) => handleOptionChange("showForecast", checked)}
                  />
                  <label
                    htmlFor="show-forecast"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Afficher les prévisions
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="calculate-growth"
                    checked={config.options.calculateGrowth || false}
                    onCheckedChange={(checked) => handleOptionChange("calculateGrowth", checked)}
                  />
                  <label
                    htmlFor="calculate-growth"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Calculer le taux de croissance
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forecast-periods">Nombre de périodes à prévoir</Label>
              <Input
                id="forecast-periods"
                type="number"
                placeholder="3"
                value={config.parameters.forecastPeriods || ""}
                onChange={(e) => handleParameterChange("forecastPeriods", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>
          Lancer l'analyse
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
