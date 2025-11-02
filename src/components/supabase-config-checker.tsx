"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SupabaseConfigChecker({ children }: { children: React.ReactNode }) {
  const [supabaseUrl, setSupabaseUrl] = useState<string>("")
  const [supabaseKey, setSupabaseKey] = useState<string>("")
  const [isConfigured, setIsConfigured] = useState<boolean>(false)
  const [isChecking, setIsChecking] = useState<boolean>(true)

  useEffect(() => {
    // Check if the variables are in localStorage
    const storedUrl = localStorage.getItem("supabase_url")
    const storedKey = localStorage.getItem("supabase_key")

    if (storedUrl && storedKey) {
      setSupabaseUrl(storedUrl)
      setSupabaseKey(storedKey)
      setIsConfigured(true)
    }

    setIsChecking(false)
  }, [])

  const saveConfig = () => {
    if (supabaseUrl && supabaseKey) {
      localStorage.setItem("supabase_url", supabaseUrl)
      localStorage.setItem("supabase_key", supabaseKey)
      setIsConfigured(true)

      // Reload the page to apply the new config
      window.location.reload()
    }
  }

  if (isChecking) {
    return <div className="flex items-center justify-center min-h-screen">Vérification de la configuration...</div>
  }

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Configuration Supabase requise</CardTitle>
            <CardDescription>
              Veuillez entrer vos informations d'identification Supabase pour continuer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Variables d'environnement manquantes</AlertTitle>
              <AlertDescription>
                Les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_KEY ne sont pas définies.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="supabase-url">URL Supabase</Label>
              <Input
                id="supabase-url"
                placeholder="https://votre-projet.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-key">Clé anonyme Supabase</Label>
              <Input
                id="supabase-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Vous pouvez trouver ces informations dans les paramètres de votre projet Supabase, sous "Project
                Settings" &gt; "API".
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveConfig} disabled={!supabaseUrl || !supabaseKey}>
              Enregistrer et continuer
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
