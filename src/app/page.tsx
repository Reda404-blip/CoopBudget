import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart2, BookOpen, Calculator, CreditCard, FileText } from "lucide-react"

export default function Home() {
  const modules = [
    {
      title: "Suivi des coûts",
      description: "Suivez et analysez les coûts de votre coopérative",
      icon: <Calculator className="h-8 w-8 text-blue-500" />,
      href: "/couts",
    },
    {
      title: "Comptabilité analytique",
      description: "Gérez votre comptabilité analytique en toute simplicité",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      href: "/comptabilite",
    },
    {
      title: "Budgets",
      description: "Créez et suivez vos budgets prévisionnels",
      icon: <CreditCard className="h-8 w-8 text-purple-500" />,
      href: "/budgets",
    },
    {
      title: "Analyse des écarts",
      description: "Analysez les écarts entre prévisions et réalisations",
      icon: <BarChart2 className="h-8 w-8 text-orange-500" />,
      href: "/analyse",
    },
    {
      title: "Analyse Budgétaire",
      description: "Effectuez des analyses budgétaires avancées",
      icon: <BarChart2 className="h-8 w-8 text-red-500" />,
      href: "/analyse-budgetaire",
    },
    {
      title: "Exercices Externes",
      description: "Résolvez des exercices de gestion budgétaire",
      icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
      href: "/exercices-externes",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold tracking-tight">Bienvenue sur CoopBudget</h1>
        <p className="text-xl text-gray-500 mt-4">La plateforme de gestion budgétaire conçue pour les coopératives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link href={module.href} key={module.title} className="block">
            <Card className="h-full hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex justify-center">{module.icon}</div>
                <CardTitle className="text-center mt-4">{module.title}</CardTitle>
                <CardDescription className="text-center">{module.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Link href={module.href} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  Accéder <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
