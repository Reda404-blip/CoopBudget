"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Save, Plus } from "lucide-react"

const initialStandardCosts = [
  {
    id: "1",
    product: "Votre Produit 1",
    category: "Votre Catégorie",
    standardCost: 12.5, // Votre coût
    unit: "kg", // Votre unité
    lastUpdated: "2024-03-07", // Date actuelle
  },
  // Ajoutez vos propres coûts standards
]

export function StandardCostsTable() {
  const [standardCosts, setStandardCosts] = useState(initialStandardCosts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCost, setNewCost] = useState({
    product: "",
    category: "",
    standardCost: "",
    unit: "",
  })

  const handleEdit = (id: string, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue)
  }

  const handleSave = (id: string) => {
    setStandardCosts(
      standardCosts.map((cost) =>
        cost.id === id
          ? { ...cost, standardCost: editValue, lastUpdated: new Date().toISOString().split("T")[0] }
          : cost,
      ),
    )
    setEditingId(null)
  }

  const handleAddNewCost = () => {
    if (newCost.product && newCost.category && newCost.standardCost && newCost.unit) {
      const newId = (standardCosts.length + 1).toString()
      setStandardCosts([
        ...standardCosts,
        {
          id: newId,
          product: newCost.product,
          category: newCost.category,
          standardCost: Number.parseFloat(newCost.standardCost),
          unit: newCost.unit,
          lastUpdated: new Date().toISOString().split("T")[0],
        },
      ])
      setNewCost({
        product: "",
        category: "",
        standardCost: "",
        unit: "",
      })
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Coûts standards par produit</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un coût standard
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau coût standard</DialogTitle>
              <DialogDescription>Définissez un coût standard pour un produit et une catégorie</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product" className="text-right">
                  Produit
                </Label>
                <Select value={newCost.product} onValueChange={(value) => setNewCost({ ...newCost, product: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produit A">Produit A</SelectItem>
                    <SelectItem value="Produit B">Produit B</SelectItem>
                    <SelectItem value="Produit C">Produit C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Catégorie
                </Label>
                <Select value={newCost.category} onValueChange={(value) => setNewCost({ ...newCost, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Matières premières">Matières premières</SelectItem>
                    <SelectItem value="Main d'œuvre directe">Main d'œuvre directe</SelectItem>
                    <SelectItem value="Emballage">Emballage</SelectItem>
                    <SelectItem value="Frais généraux">Frais généraux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cost" className="text-right">
                  Coût standard (€)
                </Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={newCost.standardCost}
                  onChange={(e) => setNewCost({ ...newCost, standardCost: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unité
                </Label>
                <Select value={newCost.unit} onValueChange={(value) => setNewCost({ ...newCost, unit: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionnez une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="unité">unité</SelectItem>
                    <SelectItem value="heure">heure</SelectItem>
                    <SelectItem value="litre">litre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddNewCost}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Coût standard (€)</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standardCosts.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell>{cost.product}</TableCell>
                <TableCell>{cost.category}</TableCell>
                <TableCell>
                  {editingId === cost.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editValue}
                      onChange={(e) => setEditValue(Number.parseFloat(e.target.value))}
                      className="w-24"
                    />
                  ) : (
                    `${cost.standardCost.toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>{cost.unit}</TableCell>
                <TableCell>{cost.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  {editingId === cost.id ? (
                    <Button size="sm" variant="outline" onClick={() => handleSave(cost.id)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(cost.id, cost.standardCost)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
