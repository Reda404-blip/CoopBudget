"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlusCircle, Save } from "lucide-react"
import { createExercice } from "@/lib/services/exercice-service"
import type { ExerciceType, Difficulty, ExerciceField } from "@/types/exercices"

export function CreateExerciceForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<{
    id: string
    title: string
    description: string
    type: ExerciceType
    difficulty: Difficulty
    fields: ExerciceField[]
  }>({
    id: "",
    title: "",
    description: "",
    type: "ecart",
    difficulty: "moyen",
    fields: [],
  })
  const [newField, setNewField] = useState({ name: "", label: "" })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddField = () => {
    if (newField.name && newField.label) {
      setFormData((prev) => ({
        ...prev,
        fields: [...prev.fields, { ...newField }],
      }))
      setNewField({ name: "", label: "" })
    }
  }

  const handleRemoveField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Validation
      if (!formData.id || !formData.title || !formData.description || formData.fields.length === 0) {
        throw new Error("Veuillez remplir tous les champs obligatoires et ajouter au moins un champ de données.")
      }

      // Créer l'exercice
      await createExercice({
        id: formData.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        difficulty: formData.difficulty,
        fields: formData.fields,
      })

      setSuccess(true)

      // Rediriger vers la liste des exercices après un court délai
      setTimeout(() => {
        router.push("/exercices-externes")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la création de l'exercice.")
      console.error("Erreur de création d'exercice:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Créer un nouvel exercice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Identifiant unique</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
              placeholder="ex: atlas-produit-b"
              required
            />
            <p className="text-xs text-gray-500">Utilisez un identifiant unique sans espaces ni caractères spéciaux.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'exercice</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="ex: Analyse des écarts - Produit B"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Décrivez l'exercice et ses objectifs..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type d'exercice</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecart">Analyse d'écarts</SelectItem>
                  <SelectItem value="optimisation">Optimisation de prix</SelectItem>
                  <SelectItem value="budget">Budget prévisionnel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Niveau de difficulté</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleChange("difficulty", value)}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facile">Facile</SelectItem>
                  <SelectItem value="moyen">Moyen</SelectItem>
                  <SelectItem value="difficile">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <Label>Champs de données</Label>
            </div>

            {formData.fields.length > 0 && (
              <div className="space-y-2">
                {formData.fields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="text-sm text-gray-500 ml-2">({field.name})</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveField(index)}>
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="fieldName">Nom du champ</Label>
                <Input
                  id="fieldName"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="ex: quantitePrevue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldLabel">Libellé</Label>
                <Input
                  id="fieldLabel"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="ex: Quantité prévue"
                />
              </div>
              <Button type="button" onClick={handleAddField} disabled={!newField.name || !newField.label}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Exercice créé avec succès! Redirection en cours...</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création en cours...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Créer l'exercice
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
