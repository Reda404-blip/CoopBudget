"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ExerciceType } from "@/types/exercices"

interface ExerciceCardProps {
  exercice: ExerciceType
}

export function ExerciceCard({ exercice }: ExerciceCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleCardClick = () => {
    router.push(`/exercices-externes/${exercice.id}`)
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isHovered ? "border-blue-500 shadow-md translate-y-[-2px]" : ""
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`exercice-card-${exercice.id}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{exercice.category}</span>
        </div>
        <CardTitle className="mt-2">{exercice.title}</CardTitle>
        <CardDescription>{exercice.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
            handleCardClick()
          }}
          aria-label={`Résoudre l'exercice ${exercice.title}`}
        >
          Résoudre <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
