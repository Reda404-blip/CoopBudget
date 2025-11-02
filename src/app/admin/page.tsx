import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SeedDatabase } from "@/components/admin/seed-database"

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">Gérez les données de l'application</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base de données</CardTitle>
          <CardDescription>Initialisez ou réinitialisez les données de l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="mb-2">
                Cliquez sur le bouton ci-dessous pour initialiser la base de données avec des données de test. Cette
                action remplacera toutes les données existantes.
              </p>
              <SeedDatabase />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
