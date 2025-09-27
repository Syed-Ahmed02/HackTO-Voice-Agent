export interface Exercise {
  id: number
  name: string
  targetReps: number
  targetSets: number
  targetWeight: string
}

export interface ExerciseData {
  actualReps: string
  actualWeight: string
  completed: boolean
}

export interface Meal {
  id: number
  name: string
  type: string
  calories: number
  protein: number
  carbs: number
  fat: number
  time: string
}

export interface DiaryEntry {
  id: number
  date: string
  time: string
  entry: string
  mood: string
  recommendations: string[]
}

export interface NutritionData {
  name: string
  value: number
  target: number
  color: string
}

export interface WorkoutPlan {
  date: string
  plan: string
  duration: string
  benefits: string
  exercises: number
}

export interface NavItem {
  name: string
  icon: string
  href: string
}
