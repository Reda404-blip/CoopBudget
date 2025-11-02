"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, FileDown, Pencil, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const initialBudgets = [
  {
    id: "1",
    name: "Votre Budget 1",
    type: "sales", // Choisissez parmi les types disponibles
    period: "annual", // Choisissez la période
    startDate: "2024-01-01", // Votre date de début
    endDate: "2024-12-31", // Votre date de fin
    amount: 250000, // Votre montant
    progress: 15, // Votre progression
    status: "active", // Statut du budget
  },
  // Ajoutez vos propres budgets
]

export function BudgetList() {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [selectedBudget, setSelectedBudget] = useState<(typeof initialBudgets)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleDelete = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id))
  }

  const viewDetails = (budget: (typeof initialBudgets)[0]) => {
    setSelectedBudget(budget)
    setIsDetailsOpen(true)
  }

  const getBudgetTypeName = (type: string) => {
    const types: Record<string, string> = {
      sales: "Ventes",
      procurement: "Approvisionnements",
      production: "Production",
      treasury: "Trésorerie",
      investment: "Investissements",
      general: "Général",
    }
    return types[type] || type
  }

  const getPeriodName = (period: string) => {
    const periods: Record<string, string> = {
      monthly: "Mensuel",
      quarterly: "Trimestriel",
      annual: "Annuel",
    }
    return periods[period] || period
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Actif</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Terminé</Badge>
      case "draft":
        return <Badge className="bg-yellow-500">Brouillon</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <Card key={budget.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium truncate" title={budget.name}>
                    {budget.name}
                  </h3>
                  {getStatusBadge(budget.status)}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <div>Type: {getBudgetTypeName(budget.type)}</div>
                  <div>Période: {getPeriodName(budget.period)}</div>
                  <div>Montant: {budget.amount.toLocaleString()}€</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{budget.progress}%</span>
                  </div>
                  <Progress value={budget.progress} className="h-2" />
                </div>
              </div>
              <div className="border-t p-3 bg-muted/50 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => viewDetails(budget)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Détails
                </Button>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(budget.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedBudget && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBudget.name}</DialogTitle>
                <DialogDescription>Détails complets du budget</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="allocation">Allocation</TabsTrigger>
                  <TabsTrigger value="progress">Progression</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Type de budget</h4>
                      <p>{getBudgetTypeName(selectedBudget.type)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Période</h4>
                      <p>{getPeriodName(selectedBudget.period)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Date de début</h4>
                      <p>{new Date(selectedBudget.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Date de fin</h4>
                      <p>{new Date(selectedBudget.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Montant total</h4>
                      <p>{selectedBudget.amount.toLocaleString()}€</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Statut</h4>
                      <p>{getStatusBadge(selectedBudget.status)}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="allocation">
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-3">Allocation du budget</h4>
                    <div className="space-y-4">
                      {selectedBudget.type === "sales" && (
                        <>
                          <div className="flex justify-between items-center">
                            <span>Marketing</span>
                            <span>75,000€ (30%)</span>
                          </div>
                          <Progress value={30} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Commissions</span>
                            <span>50,000€ (20%)</span>
                          </div>
                          <Progress value={20} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Salons professionnels</span>
                            <span>37,500€ (15%)</span>
                          </div>
                          <Progress value={15} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Publicité</span>
                            <span>62,500€ (25%)</span>
                          </div>
                          <Progress value={25} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Autres</span>
                            <span>25,000€ (10%)</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </>
                      )}

                      {selectedBudget.type === "production" && (
                        <>
                          <div className="flex justify-between items-center">
                            <span>Main d'œuvre</span>
                            <span>37,500€ (50%)</span>
                          </div>
                          <Progress value={50} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Matières premières</span>
                            <span>22,500€ (30%)</span>
                          </div>
                          <Progress value={30} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Maintenance</span>
                            <span>7,500€ (10%)</span>
                          </div>
                          <Progress value={10} className="h-2" />

                          <div className="flex justify-between items-center">
                            <span>Énergie</span>
                            <span>7,500€ (10%)</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="progress">
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-3">Progression du budget</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression globale</span>
                        <span>{selectedBudget.progress}%</span>
                      </div>
                      <Progress value={selectedBudget.progress} className="h-2" />
                    </div>

                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-medium">Détails de la progression</h4>

                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Budget alloué</span>
                          <span>{selectedBudget.amount.toLocaleString()}€</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Budget utilisé</span>
                          <span>
                            {Math.round((selectedBudget.amount * selectedBudget.progress) / 100).toLocaleString()}€
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Budget restant</span>
                          <span>
                            {Math.round(
                              (selectedBudget.amount * (100 - selectedBudget.progress)) / 100,
                            ).toLocaleString()}
                            €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
