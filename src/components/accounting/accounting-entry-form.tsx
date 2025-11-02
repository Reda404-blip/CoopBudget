"use client"

import { useState, useEffect } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SectionLoading } from "@/components/accounting/section-loading"

const formSchema = z.object({
  date: z.string({
    required_error: "Veuillez sélectionner une date",
  }),
  type: z.enum(["charge", "produit"], {
    required_error: "Veuillez sélectionner un type d'opération",
  }),
  accountNumber: z.string().min(1, {
    message: "Veuillez saisir un numéro de compte",
  }),
  amount: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Le montant doit être un nombre positif",
  }),
  description: z.string().min(3, {
    message: "La description doit contenir au moins 3 caractères",
  }),
  analyticalAxis: z.string({
    required_error: "Veuillez sélectionner un axe analytique",
  }),
  productId: z.string().optional(),
})

const products = [
  { id: "prod1", name: "Produit A" },
  { id: "prod2", name: "Produit B" },
  { id: "prod3", name: "Produit C" },
]

const chargeAccounts = [
  { number: "60", name: "Achats" },
  { number: "61", name: "Services extérieurs" },
  { number: "62", name: "Autres services extérieurs" },
  { number: "63", name: "Impôts, taxes et versements assimilés" },
  { number: "64", name: "Charges de personnel" },
  { number: "65", name: "Autres charges de gestion courante" },
  { number: "66", name: "Charges financières" },
  { number: "67", name: "Charges exceptionnelles" },
  { number: "68", name: "Dotations aux amortissements et provisions" },
]

const produitAccounts = [
  { number: "70", name: "Ventes de produits, services" },
  { number: "71", name: "Production stockée" },
  { number: "72", name: "Production immobilisée" },
  { number: "74", name: "Subventions d'exploitation" },
  { number: "75", name: "Autres produits de gestion courante" },
  { number: "76", name: "Produits financiers" },
  { number: "77", name: "Produits exceptionnels" },
  { number: "78", name: "Reprises sur amortissements et provisions" },
  { number: "79", name: "Transferts de charges" },
]

const analyticalAxes = [
  { id: "product", name: "Par produit" },
  { id: "department", name: "Par département" },
  { id: "project", name: "Par projet" },
  { id: "activity", name: "Par activité" },
]

const departments = [
  { id: "prod", name: "Production" },
  { id: "rnd", name: "R&D" },
  { id: "sales", name: "Commercial" },
  { id: "admin", name: "Administration" },
]

const projects = [
  { id: "proj1", name: "Projet Alpha" },
  { id: "proj2", name: "Projet Beta" },
  { id: "proj3", name: "Projet Gamma" },
]

const activities = [
  { id: "act1", name: "Fabrication" },
  { id: "act2", name: "Distribution" },
  { id: "act3", name: "Marketing" },
  { id: "act4", name: "Support" },
]

export function AccountingEntryForm() {
  const [entryType, setEntryType] = useState<"charge" | "produit">("charge")
  const [analyticalAxis, setAnalyticalAxis] = useState<string>("product")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("simple")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "charge",
      description: "",
      analyticalAxis: "product",
    },
  })

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Opération enregistrée",
        description: `Une ${values.type === "charge" ? "charge" : "produit"} de ${values.amount}€ a été enregistrée.`,
      })
      form.reset({
        type: entryType,
        analyticalAxis: analyticalAxis,
        date: "",
        accountNumber: "",
        amount: "",
        description: "",
        productId: "",
      })
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <SectionLoading
        title="Préparation du formulaire"
        description="Chargement des comptes et des axes analytiques..."
      />
    )
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="simple"
        className="w-full"
        value={activeTab}
        onValueChange={(value) => {
          setLoading(true)
          setTimeout(() => {
            setActiveTab(value)
            setLoading(false)
          }, 1000)
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Saisie simple</TabsTrigger>
          <TabsTrigger value="advanced">Saisie avancée</TabsTrigger>
        </TabsList>

        <TabsContent value="simple">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type d'opération</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value: "charge" | "produit") => {
                            field.onChange(value)
                            setEntryType(value)
                            form.setValue("accountNumber", "")
                          }}
                          defaultValue={field.value}
                          className="flex flex-row space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="charge" />
                            </FormControl>
                            <FormLabel className="font-normal">Charge</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="produit" />
                            </FormControl>
                            <FormLabel className="font-normal">Produit</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compte comptable</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un compte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(entryType === "charge" ? chargeAccounts : produitAccounts).map((account) => (
                          <SelectItem key={account.number} value={account.number}>
                            {account.number} - {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Sélectionnez le compte selon le Plan Comptable Général</FormDescription>
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
                  name="analyticalAxis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Axe analytique</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setAnalyticalAxis(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un axe analytique" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {analyticalAxes.map((axis) => (
                            <SelectItem key={axis.id} value={axis.id}>
                              {axis.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Axe d'analyse pour la répartition analytique</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {analyticalAxis === "product" && (
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {analyticalAxis === "department" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un département" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {analyticalAxis === "project" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Projet</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un projet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {analyticalAxis === "activity" && (
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une activité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {activities.map((activity) => (
                            <SelectItem key={activity.id} value={activity.id}>
                              {activity.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description de l'opération..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full md:w-auto">
                Enregistrer l'opération
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Saisie d'écriture comptable complète</h3>
                <p className="text-sm text-muted-foreground">
                  Utilisez ce formulaire pour saisir des écritures comptables avec plusieurs lignes (débit/crédit)
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pièce justificative</label>
                    <Input placeholder="N° de facture, reçu, etc." />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Libellé de l'écriture</label>
                  <Input placeholder="Ex: Achat de fournitures" />
                </div>

                <div className="border rounded-md p-4 space-y-4">
                  <h4 className="font-medium">Lignes d'écriture</h4>

                  <div className="border-b pb-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <label className="text-xs font-medium">Compte</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="601">601 - Achats matières premières</SelectItem>
                            <SelectItem value="607">607 - Achats de marchandises</SelectItem>
                            <SelectItem value="512">512 - Banque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-medium">Débit</label>
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-medium">Crédit</label>
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-2 flex items-end">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Axe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product">Produit</SelectItem>
                            <SelectItem value="department">Département</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="401">401 - Fournisseurs</SelectItem>
                            <SelectItem value="44566">44566 - TVA déductible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-3">
                        <Input placeholder="0.00" />
                      </div>
                      <div className="col-span-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Axe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product">Produit</SelectItem>
                            <SelectItem value="department">Département</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    + Ajouter une ligne
                  </Button>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="text-sm font-medium">Total débit: </span>
                    <span>0.00 €</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Total crédit: </span>
                    <span>0.00 €</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Différence: </span>
                    <span className="text-red-500">0.00 €</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="w-full md:w-auto">Enregistrer l'écriture</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
