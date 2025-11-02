"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FileUp, BarChart4, LineChart, PieChart, Calculator, Sliders, FileSpreadsheet, FileDown } from "lucide-react"

interface AnalyseBudgetaireNavProps extends React.HTMLAttributes<HTMLElement> {}

export function AnalyseBudgetaireNav({ className, ...props }: AnalyseBudgetaireNavProps) {
  const pathname = usePathname()

  const items = [
    {
      title: "Vue d'ensemble",
      href: "/analyse-budgetaire",
      icon: BarChart4,
    },
    {
      title: "Importation",
      href: "/analyse-budgetaire/importation",
      icon: FileUp,
    },
    {
      title: "Analyse des écarts",
      href: "/analyse-budgetaire/ecarts",
      icon: Calculator,
    },
    {
      title: "Optimisation",
      href: "/analyse-budgetaire/optimisation",
      icon: Sliders,
    },
    {
      title: "Tendances",
      href: "/analyse-budgetaire/tendances",
      icon: LineChart,
    },
    {
      title: "Distribution",
      href: "/analyse-budgetaire/distribution",
      icon: PieChart,
    },
    {
      title: "Rapports",
      href: "/analyse-budgetaire/rapports",
      icon: FileSpreadsheet,
    },
    {
      title: "Exportation",
      href: "/analyse-budgetaire/exportation",
      icon: FileDown,
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start gap-2",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
