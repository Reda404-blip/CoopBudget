"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { SectionLoading } from "@/components/accounting/section-loading"

const journalEntries = [
  {
    id: "1",
    date: "2024-03-07", // Date actuelle
    accountNumber: "607", // Votre numéro de compte
    accountName: "Votre nom de compte",
    description: "Votre description",
    debit: 1250.0, // Votre montant
    credit: 0,
    type: "charge",
    analyticalAxis: "Votre Produit",
  },
  // Ajoutez vos propres écritures comptables
]

export function AccountingJournal() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.accountNumber.includes(searchTerm) ||
      entry.accountName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDate = selectedDate ? entry.date === format(selectedDate, "yyyy-MM-dd") : true

    const matchesType =
      selectedType === "all" ? true : selectedType === "charge" ? entry.type === "charge" : entry.type === "produit"

    return matchesSearch && matchesDate && matchesType
  })

  // Simulate loading when filters change
  const handleFilterChange = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 800)
  }

  if (loading) {
    return (
      <SectionLoading
        title="Chargement du journal comptable"
        description="Récupération et analyse des écritures comptables..."
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleFilterChange()
              }}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  handleFilterChange()
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select
            value={selectedType}
            onValueChange={(value) => {
              setSelectedType(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type d'opération" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="charge">Charges</SelectItem>
              <SelectItem value="produit">Produits</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setSearchTerm("")
              setSelectedDate(undefined)
              setSelectedType("all")
              handleFilterChange()
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" className="w-full md:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Compte</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Débit (€)</TableHead>
              <TableHead className="text-right">Crédit (€)</TableHead>
              <TableHead>Axe analytique</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <div className="font-medium">{entry.accountNumber}</div>
                  <div className="text-xs text-muted-foreground">{entry.accountName}</div>
                </TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right">
                  {entry.debit > 0 ? entry.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {entry.credit > 0 ? entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{entry.analyticalAxis}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <div>
          <span className="text-sm font-medium">Total débit: </span>
          <span>
            {filteredEntries
              .reduce((sum, entry) => sum + entry.debit, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            €
          </span>
        </div>
        <div>
          <span className="text-sm font-medium">Total crédit: </span>
          <span>
            {filteredEntries
              .reduce((sum, entry) => sum + entry.credit, 0)
              .toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
            €
          </span>
        </div>
      </div>
    </div>
  )
}
