"use client"

import { useState, useEffect } from "react"
import {
  type Cost,
  getCosts,
  createCost,
  updateCost,
  deleteCost,
  type StandardCost,
  getStandardCosts,
  createStandardCost,
  updateStandardCost,
  deleteStandardCost,
} from "@/lib/services/cost-service"

export function useCosts() {
  const [costs, setCosts] = useState<Cost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCosts() {
      try {
        setLoading(true)
        const data = await getCosts()
        setCosts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch costs"))
      } finally {
        setLoading(false)
      }
    }

    fetchCosts()
  }, [])

  const addCost = async (cost: Omit<Cost, "id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true)
      const newCost = await createCost(cost)
      setCosts([...costs, newCost])
      return newCost
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add cost"))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editCost = async (id: string, updates: Partial<Cost>) => {
    try {
      setLoading(true)
      const updatedCost = await updateCost(id, updates)
      setCosts(costs.map((c) => (c.id === id ? updatedCost : c)))
      return updatedCost
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update cost ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeCost = async (id: string) => {
    try {
      setLoading(true)
      await deleteCost(id)
      setCosts(costs.filter((c) => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete cost ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    costs,
    loading,
    error,
    addCost,
    editCost,
    removeCost,
  }
}

export function useStandardCosts() {
  const [standardCosts, setStandardCosts] = useState<StandardCost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchStandardCosts() {
      try {
        setLoading(true)
        const data = await getStandardCosts()
        setStandardCosts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch standard costs"))
      } finally {
        setLoading(false)
      }
    }

    fetchStandardCosts()
  }, [])

  const addStandardCost = async (standardCost: Omit<StandardCost, "id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true)
      const newStandardCost = await createStandardCost(standardCost)
      setStandardCosts([...standardCosts, newStandardCost])
      return newStandardCost
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add standard cost"))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editStandardCost = async (id: string, updates: Partial<StandardCost>) => {
    try {
      setLoading(true)
      const updatedStandardCost = await updateStandardCost(id, updates)
      setStandardCosts(standardCosts.map((sc) => (sc.id === id ? updatedStandardCost : sc)))
      return updatedStandardCost
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update standard cost ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeStandardCost = async (id: string) => {
    try {
      setLoading(true)
      await deleteStandardCost(id)
      setStandardCosts(standardCosts.filter((sc) => sc.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete standard cost ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    standardCosts,
    loading,
    error,
    addStandardCost,
    editStandardCost,
    removeStandardCost,
  }
}
