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

const formSchema = z.object({
  productId: z.string({
    required_error: "Veuillez sélectionner un produit",
  }),
  costType: z.enum(["direct", "indirect"], {
    required_error: "Veuillez sélectionner un type de coût",
  }),
  costCategory: z.string({
    required_error: "Veuillez sélectionner une catégorie",
  }),
  amount: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Le montant doit être un nombre positif",
  }),
  date: z.string({
    required_error: "Veuillez sélectionner une date",
  }),
  description: z.string().optional(),
})

const products = [
  { id: "prod1", name: "Votre Produit 1" },
  { id: "prod2", name: "Votre Produit 2" },
  // Ajoutez vos propres produits
]

const directCategories = [
  { id: "cat1", name: "Votre Catégorie 1" },
  { id: "cat2", name: "Votre Catégorie 2" },
  // Ajoutez vos propres catégories
]

const indirectCategories = [
  { id: "indir1", name: "Votre Catégorie Indirecte 1" },
  { id: "indir2", name: "Votre Catégorie Indirecte 2" },
  // Ajoutez vos propres catégories indirectes
]

export function CostEntryForm() {
  const [costType, setCostType] = useState<"direct" | "indirect">("direct")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      costType: "direct",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Coût enregistré",
      description: `Un coût de ${values.amount}€ a été enregistré pour le ${values.productId}.`,
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Sélectionnez le produit concerné par ce coût</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="costType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type de coût</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value: "direct" | "indirect") => {
                    field.onChange(value)
                    setCostType(value)
                    form.setValue("costCategory", "")
                  }}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="direct" />
                    </FormControl>
                    <FormLabel className="font-normal">Coût direct</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="indirect" />
                    </FormControl>
                    <FormLabel className="font-normal">Coût indirect</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="costCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(costType === "direct" ? directCategories : indirectCategories).map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Catégorie à laquelle ce coût appartient</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Montant (€)</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnelle)</FormLabel>
              <FormControl>
                <Textarea placeholder="Détails supplémentaires sur ce coût..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">
          Enregistrer le coût
        </Button>
      </form>
    </Form>
  )
}
