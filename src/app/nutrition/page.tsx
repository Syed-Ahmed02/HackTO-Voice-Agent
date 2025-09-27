"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Apple,
  Mic,
  Plus,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { nutritionData, todaysMeals, todaysWorkout } from "@/lib/data"
import { Meal } from "@/lib/types"

export default function NutritionPage() {
  const startVoiceChat = () => {
    // Placeholder for Vapi integration
    console.log("Starting voice chat with AI nutritionist...")
  }

  return (
    <div className="space-y-6">
      {/* Today's Date and Nutrition Summary */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{todaysWorkout.date}</span>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Nutrition Tracking</h1>

        <Card className="border-primary/20 bg-accent/30 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Daily Goal: 2000 cal</span>
              </div>
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                <span className="font-medium">Consumed: 830 cal</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium">Remaining: 1170 cal</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Stay on track with your nutrition goals. Your AI nutritionist recommends adding more protein-rich foods.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Macronutrient Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Macros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nutritionData.map((macro) => (
                <div key={macro.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{macro.name}</span>
                    <span className="text-muted-foreground">
                      {macro.value}g / {macro.target}g
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((macro.value / macro.target) * 100, 100)}%`,
                        backgroundColor: macro.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Diet Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">For Your Goals</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Add 30g more protein to support muscle growth</li>
                <li>• Include complex carbs pre-workout</li>
                <li>• Consider omega-3 rich foods for recovery</li>
              </ul>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90" onClick={startVoiceChat}>
              <Mic className="h-4 w-4 mr-2" />
              Ask AI Nutritionist
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Meals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Meals</span>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysMeals.map((meal: Meal) => (
              <Card key={meal.id} className="border border-muted">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{meal.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {meal.type} • {meal.time}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-primary">{meal.calories} cal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Protein: </span>
                      <span className="font-medium">{meal.protein}g</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Carbs: </span>
                      <span className="font-medium">{meal.carbs}g</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fat: </span>
                      <span className="font-medium">{meal.fat}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
