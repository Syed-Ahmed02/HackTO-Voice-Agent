"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dumbbell,
  Mic,
  Check,
  Calendar,
  Clock,
  Zap,
} from "lucide-react"
import { exercises, todaysWorkout } from "@/lib/data"
import { Exercise, ExerciseData } from "@/lib/types"

export default function FitnessPage() {
  const [pendingExercises, setPendingExercises] = useState<Exercise[]>(exercises)
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([])
  const [exerciseData, setExerciseData] = useState<Record<number, ExerciseData>>(
    exercises.reduce(
      (acc, exercise) => ({
        ...acc,
        [exercise.id]: {
          actualReps: "",
          actualWeight: "",
          completed: false,
        },
      }),
      {} as Record<number, ExerciseData>,
    ),
  )

  const handleExerciseUpdate = (exerciseId: number, field: string, value: string | boolean) => {
    setExerciseData((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }))
  }

  const handleLogWorkout = (exerciseId: number) => {
    const exercise = pendingExercises.find((ex) => ex.id === exerciseId)
    if (exercise && exerciseData[exerciseId]?.completed) {
      // Move to completed stack
      setPendingExercises((prev) => prev.filter((ex) => ex.id !== exerciseId))
      setCompletedExercises((prev) => [...prev, exercise])
    }
    console.log("Logging workout for exercise:", exerciseId, exerciseData[exerciseId])
  }

  const startVoiceChat = () => {
    // Placeholder for Vapi integration
    console.log("Starting voice chat with AI trainer...")
  }

  return (
    <div className="space-y-6">
      {/* Today's Date and Workout Summary */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{todaysWorkout.date}</span>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">{todaysWorkout.plan}</h1>

        <Card className="border-primary/20 bg-accent/30 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">{todaysWorkout.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span className="font-medium">{todaysWorkout.exercises} exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">Strength Focus</span>
              </div>
            </div>
            <p className="text-muted-foreground">{todaysWorkout.benefits}</p>
          </CardContent>
        </Card>
      </div>

      {/* Talk to Personal Trainer - Main Feature */}
      <Card className="border-primary/30 bg-primary/5 mb-8">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <Mic className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Talk to Your AI Personal Trainer</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Get real-time guidance, motivation, and workout adjustments. Your AI trainer is here to help you succeed!
            </p>
            <Button
              onClick={startVoiceChat}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Voice Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Stacks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Exercises Stack */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Up Next ({pendingExercises.length})
          </h3>
          <div className="space-y-4">
            {pendingExercises.map((exercise, index) => (
              <Card
                key={exercise.id}
                className={`border shadow-md hover:shadow-lg transition-all duration-200 ${index === 0 ? "ring-2 ring-primary/20 border-primary/30" : ""}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {exercise.name}
                    {index === 0 && (
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Current</span>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {exercise.targetReps} reps × {exercise.targetSets} sets @ {exercise.targetWeight}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Actual Reps</label>
                      <Input
                        type="number"
                        placeholder={exercise.targetReps.toString()}
                        value={exerciseData[exercise.id]?.actualReps || ""}
                        onChange={(e) => handleExerciseUpdate(exercise.id, "actualReps", e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Weight Used</label>
                      <Input
                        placeholder={exercise.targetWeight}
                        value={exerciseData[exercise.id]?.actualWeight || ""}
                        onChange={(e) => handleExerciseUpdate(exercise.id, "actualWeight", e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`completed-${exercise.id}`}
                        checked={exerciseData[exercise.id]?.completed || false}
                        onCheckedChange={(checked) =>
                          handleExerciseUpdate(exercise.id, "completed", checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`completed-${exercise.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Completed
                      </label>
                    </div>

                    <Button
                      onClick={() => handleLogWorkout(exercise.id)}
                      disabled={!exerciseData[exercise.id]?.completed}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                    >
                      Complete & Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingExercises.length === 0 && (
              <Card className="border-dashed border-2 border-primary/20">
                <CardContent className="p-8 text-center">
                  <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">All Exercises Complete!</h3>
                  <p className="text-muted-foreground">Great job finishing today's workout!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Completed Exercises Stack */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Completed ({completedExercises.length})
          </h3>
          <div className="space-y-4">
            {completedExercises.map((exercise) => (
              <Card key={exercise.id} className="border border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-5 w-5 text-primary" />
                    {exercise.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Target: {exercise.targetReps} reps × {exercise.targetSets} sets @ {exercise.targetWeight}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    Completed: {exerciseData[exercise.id]?.actualReps || exercise.targetReps} reps @{" "}
                    {exerciseData[exercise.id]?.actualWeight || exercise.targetWeight}
                  </p>
                </CardHeader>
              </Card>
            ))}
            {completedExercises.length === 0 && (
              <Card className="border-dashed border-2 border-muted-foreground/20">
                <CardContent className="p-8 text-center">
                  <Dumbbell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Completed exercises will appear here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
