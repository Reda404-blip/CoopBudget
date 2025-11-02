"use client"

import { useEffect, useState } from "react"
import { analysisService, type Analysis } from "@/lib/services/analysis-service"
import { useToast } from "@/hooks/use-toast"

export function useAnalyses(options?: {
  userId?: string
  type?: string
  limit?: number
  offset?: number
  isPublic?: boolean
  tags?: string[]
  search?: string
  realtime?: boolean
}) {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      const data = await analysisService.getAnalyses(options)
      setAnalyses(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching analyses:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch analyses"))
      toast({
        title: "Error",
        description: "Failed to fetch analyses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()

    // Set up real-time subscription if enabled
    if (options?.realtime) {
      const subscription = analysisService.subscribeToAnalyses((payload) => {
        // Handle different types of changes
        const { eventType, new: newRecord, old: oldRecord } = payload

        if (eventType === "INSERT") {
          setAnalyses((prev) => [newRecord, ...prev])
        } else if (eventType === "UPDATE") {
          setAnalyses((prev) => prev.map((item) => (item.id === newRecord.id ? newRecord : item)))
        } else if (eventType === "DELETE") {
          setAnalyses((prev) => prev.filter((item) => item.id !== oldRecord.id))
        }
      })

      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [
    options?.userId,
    options?.type,
    options?.limit,
    options?.offset,
    options?.isPublic,
    options?.search,
    // We need to stringify the tags array to avoid infinite re-renders
    JSON.stringify(options?.tags),
  ])

  const refreshAnalyses = () => {
    fetchAnalyses()
  }

  return {
    analyses,
    loading,
    error,
    refreshAnalyses,
  }
}

export function useAnalysis(id: string, options?: { realtime?: boolean }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      const data = await analysisService.getAnalysisById(id)
      setAnalysis(data)
      setError(null)
    } catch (err) {
      console.error(`Error fetching analysis with ID ${id}:`, err)
      setError(err instanceof Error ? err : new Error("Failed to fetch analysis"))
      toast({
        title: "Error",
        description: "Failed to fetch analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchAnalysis()

      // Set up real-time subscription if enabled
      if (options?.realtime) {
        const subscription = analysisService.subscribeToAnalyses((payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          // Only update if the change is for this analysis
          if (newRecord?.id === id || oldRecord?.id === id) {
            if (eventType === "UPDATE") {
              setAnalysis(newRecord)
            } else if (eventType === "DELETE") {
              setAnalysis(null)
              toast({
                title: "Analysis Deleted",
                description: "This analysis has been deleted.",
                variant: "destructive",
              })
            }
          }
        })

        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe()
        }
      }
    }
  }, [id, options?.realtime])

  const refreshAnalysis = () => {
    fetchAnalysis()
  }

  return {
    analysis,
    loading,
    error,
    refreshAnalysis,
  }
}
