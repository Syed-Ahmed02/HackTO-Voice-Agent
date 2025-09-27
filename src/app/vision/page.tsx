"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Target, Calendar, TrendingUp, Award } from "lucide-react"

export default function VisionPage() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Lose 20 pounds",
      targetDate: "2024-06-01",
      progress: 60,
      status: "In Progress"
    },
    {
      id: 2,
      title: "Run a 5K",
      targetDate: "2024-05-15",
      progress: 80,
      status: "Almost There"
    },
    {
      id: 3,
      title: "Build muscle mass",
      targetDate: "2024-08-01",
      progress: 30,
      status: "Getting Started"
    }
  ])

  const [newGoal, setNewGoal] = useState("")
  const [newTargetDate, setNewTargetDate] = useState("")

  const addGoal = () => {
    if (newGoal && newTargetDate) {
      const goal = {
        id: goals.length + 1,
        title: newGoal,
        targetDate: newTargetDate,
        progress: 0,
        status: "New"
      }
      setGoals([...goals, goal])
      setNewGoal("")
      setNewTargetDate("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Long Term Vision</h1>
        <p className="text-muted-foreground text-lg">
          Set and track your long-term health and fitness goals
        </p>
      </div>

      {/* Add New Goal */}
      <Card className="border-primary/20 bg-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Add New Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Goal Description</label>
              <Input
                placeholder="e.g., Run a marathon"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Target Date</label>
              <Input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="h-10"
              />
            </div>
          </div>
          <Button
            onClick={addGoal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Add Goal
          </Button>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="border shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                {goal.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Target: {new Date(goal.targetDate).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{goal.status}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    const updatedGoals = goals.map(g => 
                      g.id === goal.id 
                        ? { ...g, progress: Math.min(100, g.progress + 10) }
                        : g
                    )
                    setGoals(updatedGoals)
                  }}
                >
                  Update Progress
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    const updatedGoals = goals.filter(g => g.id !== goal.id)
                    setGoals(updatedGoals)
                  }}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <h4 className="font-semibold">First Workout Complete</h4>
                <p className="text-sm text-muted-foreground">Completed your first workout session</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-semibold">Consistency Streak</h4>
                <p className="text-sm text-muted-foreground">7 days of consistent workouts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
