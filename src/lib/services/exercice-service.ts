import { supabase } from "@/lib/supabase"
import type { Exercice, CreateExerciceData, ExerciceResultData } from "@/types/exercices"

export const getExercices = async (): Promise<Exercice[]> => {
  const { data, error } = await supabase
    .from("exercices")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching exercices:", error)
    throw error
  }

  return data || []
}

export const getExerciceById = async (id: string): Promise<Exercice | null> => {
  const { data, error } = await supabase
    .from("exercices")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching exercice with ID ${id}:`, error)
    throw error
  }

  return data
}

export const createExercice = async (exerciceData: CreateExerciceData): Promise<Exercice> => {
  const { data, error } = await supabase
    .from("exercices")
    .insert(exerciceData)
    .select()
    .single()

  if (error) {
    console.error("Error creating exercice:", error)
    throw error
  }

  return data
}

export const updateExercice = async (id: string, updates: Partial<CreateExerciceData>): Promise<Exercice> => {
  const { data, error } = await supabase
    .from("exercices")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating exercice with ID ${id}:`, error)
    throw error
  }

  return data
}

export const deleteExercice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("exercices")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(`Error deleting exercice with ID ${id}:`, error)
    throw error
  }
}

export const saveExerciceResult = async (resultData: ExerciceResultData): Promise<ExerciceResultData> => {
  const { data, error } = await supabase
    .from("exercice_results")
    .insert(resultData)
    .select()
    .single()

  if (error) {
    console.error("Error saving exercice result:", error)
    throw error
  }

  return data
}

export const getExerciceResults = async (exerciceId: string): Promise<ExerciceResultData[]> => {
  const { data, error } = await supabase
    .from("exercice_results")
    .select("*")
    .eq("exercice_id", exerciceId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching results for exercice ${exerciceId}:`, error)
    throw error
  }

  return data || []
}
