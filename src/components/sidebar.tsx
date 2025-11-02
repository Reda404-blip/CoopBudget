"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, BookOpen, Calculator, CreditCard, FileText, Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: Home,
      title: "Accueil",
    },
    {
      href: "/couts",
      icon: Calculator,
      title: "Suivi des coûts",
    },
    {
      href: "/comptabilite",
      icon: FileText,
      title: "Comptabilité",
    },
    {
      href: "/budgets",
      icon: CreditCard,
      title: "Budgets",
    },
    {
      href: "/analyse",
      icon: BarChart2,
      title: "Analyse des écarts",
    },
    {
      href: "/analyse-budgetaire",
      icon: BarChart2,
      title: "Analyse Budgétaire",
    },
    {
      href: "/exercices-externes",
      icon: BookOpen,
      title: "Exercices Externes",
    },
    {
      href: "/admin",
      icon: Settings,
      title: "Administration",
    },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-xl font-bold">CoopBudget</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === route.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <route.icon className="h-5 w-5" />
                {route.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
