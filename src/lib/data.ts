// Mock data for progress chart
export const progressData = [
  { date: "Mon", weight: 50 },
  { date: "Tue", weight: 55 },
  { date: "Wed", weight: 52 },
  { date: "Thu", weight: 60 },
  { date: "Fri", weight: 65 },
  { date: "Sat", weight: 70 },
  { date: "Sun", weight: 80 },
]

// Mock exercise data
export const exercises = [
  {
    id: 1,
    name: "Bicep Curls",
    targetReps: 15,
    targetSets: 3,
    targetWeight: "10LB",
  },
  {
    id: 2,
    name: "Squats",
    targetReps: 20,
    targetSets: 3,
    targetWeight: "Bodyweight",
  },
  {
    id: 3,
    name: "Push-ups",
    targetReps: 10,
    targetSets: 3,
    targetWeight: "None",
  },
  {
    id: 4,
    name: "Deadlifts",
    targetReps: 8,
    targetSets: 3,
    targetWeight: "25LB",
  },
]

export const nutritionData = [
  { name: "Protein", value: 120, target: 150, color: "#10B981" },
  { name: "Carbs", value: 200, target: 250, color: "#3B82F6" },
  { name: "Fat", value: 60, target: 80, color: "#F59E0B" },
]

export const todaysMeals = [
  {
    id: 1,
    name: "Greek Yogurt with Berries",
    type: "Breakfast",
    calories: 250,
    protein: 20,
    carbs: 30,
    fat: 8,
    time: "8:00 AM",
  },
  {
    id: 2,
    name: "Grilled Chicken Salad",
    type: "Lunch",
    calories: 400,
    protein: 35,
    carbs: 25,
    fat: 18,
    time: "12:30 PM",
  },
  {
    id: 3,
    name: "Protein Smoothie",
    type: "Snack",
    calories: 180,
    protein: 25,
    carbs: 15,
    fat: 4,
    time: "3:00 PM",
  },
]

export const diaryEntries = [
  {
    id: 1,
    date: "Today",
    time: "9:15 AM",
    entry: "Feeling energetic after breakfast. Ready for today's upper body workout!",
    mood: "Energetic",
    recommendations: ["Increase protein intake by 10g", "Add 15 minutes to cardio session"],
  },
  {
    id: 2,
    date: "Yesterday",
    time: "7:30 PM",
    entry: "Completed full workout but felt tired. Maybe need more sleep.",
    mood: "Tired",
    recommendations: ["Aim for 8 hours of sleep", "Consider reducing workout intensity"],
  },
]

export const todaysWorkout = {
  date: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  plan: "Upper Body Strength",
  duration: "45 minutes",
  benefits: "Build muscle mass, improve posture, and increase upper body strength",
  exercises: 4,
}

export const navItems = [
  { name: "Nutrition", icon: "Apple", href: "/nutrition" },
  { name: "Fitness", icon: "Dumbbell", href: "/fitness" },
  { name: "Daily Diary", icon: "BookOpen", href: "/diary" },
  { name: "Progress", icon: "BarChart3", href: "/progress" },
  { name: "Long Term Vision", icon: "Target", href: "/vision" },
]
