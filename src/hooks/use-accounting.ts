"use client"

import { useState, useEffect } from "react"
import {
  type AccountingEntry,
  getAccountingEntries,
  createAccountingEntry,
  updateAccountingEntry,
  deleteAccountingEntry,
} from "@/lib/services/accounting-service"

export function useAccountingEntries() {
  const [entries, setEntries] = useState<AccountingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true)
        const data = await getAccountingEntries()
        setEntries(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch accounting entries"))
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const addEntry = async (entry: Omit<AccountingEntry, "id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true)
      const newEntry = await createAccountingEntry(entry)
      setEntries([...entries, newEntry])
      return newEntry
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add accounting entry"))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editEntry = async (id: string, updates: Partial<AccountingEntry>) => {
    try {
      setLoading(true)
      const updatedEntry = await updateAccountingEntry(id, updates)
      setEntries(entries.map((e) => (e.id === id ? updatedEntry : e)))
      return updatedEntry
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update accounting entry ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeEntry = async (id: string) => {
    try {
      setLoading(true)
      await deleteAccountingEntry(id)
      setEntries(entries.filter((e) => e.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete accounting entry ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    entries,
    loading,
    error,
    addEntry,
    editEntry,
    removeEntry,
  }
}
