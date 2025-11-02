"use client"

import { useState, useEffect } from "react"
import { type Budget, getBudgets, createBudget, updateBudget, deleteBudget } from "@/lib/services/budget-service"

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchBudgets() {
      try {
        setLoading(true)
        const data = await getBudgets()
        setBudgets(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch budgets"))
      } finally {
        setLoading(false)
      }
    }

    fetchBudgets()
  }, [])

  const addBudget = async (budget: Omit<Budget, "id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true)
      const newBudget = await createBudget(budget)
      setBudgets([...budgets, newBudget])
      return newBudget
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add budget"))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      setLoading(true)
      const updatedBudget = await updateBudget(id, updates)
      setBudgets(budgets.map((b) => (b.id === id ? updatedBudget : b)))
      return updatedBudget
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update budget ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeBudget = async (id: string) => {
    try {
      setLoading(true)
      await deleteBudget(id)
      setBudgets(budgets.filter((b) => b.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete budget ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    budgets,
    loading,
    error,
    addBudget,
    editBudget,
    removeBudget,
  }
}
