export type ExerciceType = 'ecart' | 'optimisation' | 'budget'
export type Difficulty = 'facile' | 'moyen' | 'difficile'
export type ImportMethod = 'manual' | 'file' | 'api' | null

export interface ExerciceField {
  name: string
  label: string
}

export interface Exercice {
  id: string
  title: string
  description: string
  type: ExerciceType
  difficulty: Difficulty
  fields: ExerciceField[]
  created_at?: string
}

export interface ExerciceResult {
  title: string
  value: string
  type: 'positive' | 'negative' | 'neutral'
  description: string
}

export interface CreateExerciceData {
  id: string
  title: string
  description: string
  type: ExerciceType
  difficulty: Difficulty
  fields: ExerciceField[]
}

export interface ExerciceResultData {
  id?: string
  exercice_id: string
  user_id?: string
  input_data: Record<string, any>
  result_data: Record<string, any>
  created_at?: string
}
