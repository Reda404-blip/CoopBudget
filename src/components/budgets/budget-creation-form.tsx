"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom du budget doit contenir au moins 3 caractères",
  }),
  type: z.string({
    required_error: "Veuillez sélectionner un type de budget",
  }),
  period: z.string({
    required_error: "Veuillez sélectionner une période",
  }),
  startDate: z.string({
    required_error: "Veuillez sélectionner une date de début",
  }),
  endDate: z.string({
    required_error: "Veuillez sélectionner une date de fin",
  }),
  amount: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Le montant doit être un nombre positif",
  }),
  method: z.enum(["incremental", "zero", "flexible"], {
    required_error: "Veuillez sélectionner une méthode de budgétisation",
  }),
  description: z.string().optional(),
})

export function BudgetCreationForm() {
  const [selectedType, setSelectedType] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "incremental",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Budget créé",
      description: `Le budget ${values.name} a été créé avec succès.`,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du budget</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Budget des ventes 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de budget</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedType(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de budget" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sales">Budget des ventes</SelectItem>
                    <SelectItem value="procurement">Budget des approvisionnements</SelectItem>
                    <SelectItem value="production">Budget de production</SelectItem>
                    <SelectItem value="treasury">Budget de trésorerie</SelectItem>
                    <SelectItem value="investment">Budget des investissements</SelectItem>
                    <SelectItem value="general">Budget général</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Le type de budget détermine les sections et les calculs spécifiques</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Période</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une période" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="quarterly">Trimestriel</SelectItem>
                    <SelectItem value="annual">Annuel</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant total (€)</FormLabel>
              <FormControl>
                <Input placeholder="0.00" {...field} />
              </FormControl>
              <FormDescription>Montant total alloué pour ce budget</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Méthode de budgétisation</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="incremental" />
                    </FormControl>
                    <FormLabel className="font-normal">Budgétisation incrémentale (basée sur l'historique)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="zero" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Budgétisation base zéro (justification de chaque dépense)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="flexible" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Budgétisation flexible (ajustement selon le niveau d'activité)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnelle)</FormLabel>
              <FormControl>
                <Textarea placeholder="Détails supplémentaires sur ce budget..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Paramètres spécifiques - {getBudgetTypeName(selectedType)}</CardTitle>
              <CardDescription>Configurez les paramètres spécifiques à ce type de budget</CardDescription>
            </CardHeader>
            <CardContent>{renderSpecificBudgetFields(selectedType)}</CardContent>
          </Card>
        )}

        <Button type="submit" className="w-full md:w-auto">
          Créer le budget
        </Button>
      </form>
    </Form>
  )
}

function getBudgetTypeName(type: string): string {
  const types: Record<string, string> = {
    sales: "Budget des ventes",
    procurement: "Budget des approvisionnements",
    production: "Budget de production",
    treasury: "Budget de trésorerie",
    investment: "Budget des investissements",
    general: "Budget général",
  }
  return types[type] || type
}

function renderSpecificBudgetFields(type: string) {
  switch (type) {
    case "sales":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="forecast-method">Méthode de prévision</Label>
              <Select defaultValue="historical">
                <SelectTrigger id="forecast-method">
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="historical">Moyenne historique</SelectItem>
                  <SelectItem value="trend">Analyse de tendance</SelectItem>
                  <SelectItem value="market">Étude de marché</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sales-growth">Croissance prévue (%)</Label>
              <Input id="sales-growth" type="number" placeholder="5" />
            </div>
          </div>
        </div>
      )
    case "procurement":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier-count">Nombre de fournisseurs</Label>
              <Input id="supplier-count" type="number" placeholder="3" />
            </div>
            <div>
              <Label htmlFor="stock-policy">Politique de stock</Label>
              <Select defaultValue="jit">
                <SelectTrigger id="stock-policy">
                  <SelectValue placeholder="Sélectionnez une politique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jit">Juste-à-temps</SelectItem>
                  <SelectItem value="safety">Stock de sécurité</SelectItem>
                  <SelectItem value="seasonal">Saisonnier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    case "production":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="production-capacity">Capacité de production</Label>
              <Input id="production-capacity" type="number" placeholder="1000" />
            </div>
            <div>
              <Label htmlFor="production-unit">Unité de production</Label>
              <Select defaultValue="unit">
                <SelectTrigger id="production-unit">
                  <SelectValue placeholder="Sélectionnez une unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">Unités</SelectItem>
                  <SelectItem value="kg">Kilogrammes</SelectItem>
                  <SelectItem value="batch">Lots</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    case "treasury":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="initial-balance">Solde initial (€)</Label>
              <Input id="initial-balance" type="number" placeholder="10000" />
            </div>
            <div>
              <Label htmlFor="min-balance">Solde minimum (€)</Label>
              <Input id="min-balance" type="number" placeholder="5000" />
            </div>
          </div>
        </div>
      )
    case "investment":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roi-target">Objectif de ROI (%)</Label>
              <Input id="roi-target" type="number" placeholder="15" />
            </div>
            <div>
              <Label htmlFor="investment-type">Type d'investissement</Label>
              <Select defaultValue="equipment">
                <SelectTrigger id="investment-type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Équipement</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="research">Recherche et développement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    case "general":
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="include-subbudgets">Inclure les sous-budgets</Label>
              <Select defaultValue="all">
                <SelectTrigger id="include-subbudgets">
                  <SelectValue placeholder="Sélectionnez les budgets à inclure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les budgets</SelectItem>
                  <SelectItem value="operational">Budgets opérationnels uniquement</SelectItem>
                  <SelectItem value="custom">Sélection personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="consolidation-method">Méthode de consolidation</Label>
              <Select defaultValue="sum">
                <SelectTrigger id="consolidation-method">
                  <SelectValue placeholder="Sélectionnez une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sum">Somme simple</SelectItem>
                  <SelectItem value="weighted">Pondérée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )
    default:
      return null
  }
}

import { Label } from "@/components/ui/label"
