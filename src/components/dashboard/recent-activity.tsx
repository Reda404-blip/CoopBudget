import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: { name: "Votre Nom", avatar: "VN" },
    action: "a ajouté une nouvelle dépense",
    target: "Description de la dépense",
    amount: "€X,XXX.XX",
    date: "Date appropriée",
  },
  // Ajoutez vos propres activités
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Les 5 dernières actions effectuées dans l'application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={activity.user.name} />
                <AvatarFallback>{activity.user.avatar}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activity.target} {activity.amount && <span className="font-medium">{activity.amount}</span>}
                </p>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">{activity.date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
