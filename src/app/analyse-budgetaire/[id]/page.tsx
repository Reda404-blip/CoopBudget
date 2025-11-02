"use client"

import { useParams, useRouter } from "next/navigation"
import { useAnalysis } from "@/hooks/use-analyses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Download, Share, Trash } from "lucide-react"
import { analysisService } from "@/lib/services/analysis-service"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { analysis, loading, error } = useAnalysis(params.id as string, { realtime: true })

  const formatDate = (dateString: string) => {
    try {
      return `Il y a ${formatDistanceToNow(new Date(dateString), { locale: fr })}`
    } catch (e) {
      return "Date inconnue"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleDelete = async () => {
    try {
      await analysisService.deleteAnalysis(params.id as string)
      toast({
        title: "Analyse supprimée",
        description: "L'analyse a été supprimée avec succès.",
      })
      router.push("/analyse-budgetaire")
    } catch (error) {
      console.error("Error deleting analysis:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'analyse.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Analyse non trouvée</h2>
          <p className="text-muted-foreground">L'analyse que vous recherchez n'existe pas ou a été supprimée.</p>
        </div>
        <Button onClick={() => router.push("/analyse-budgetaire")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux analyses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{analysis.title}</h1>
          <p className="text-muted-foreground">{analysis.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Télécharger</span>
          </Button>
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
            <span className="sr-only">Partager</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4" />
            <span className="sr-only">Supprimer</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={analysis.users?.avatar_url || ""} alt={analysis.users?.name || "User"} />
          <AvatarFallback>{analysis.users?.name ? getInitials(analysis.users.name) : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
          <span>{analysis.users?.name || "Utilisateur inconnu"}</span>
          <span className="hidden sm:inline text-muted-foreground">•</span>
          <span className="text-muted-foreground">{formatDate(analysis.created_at)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Résultats de l'analyse</CardTitle>
          <CardDescription>Visualisation et interprétation des données analysées</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Render analysis content based on analysis.data and analysis.type */}
          {analysis.data ? (
            <div>
              {/* This would be replaced with actual visualization components */}
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(analysis.data, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Aucune donnée d'analyse disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette analyse ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'analyse sera définitivement supprimée de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
