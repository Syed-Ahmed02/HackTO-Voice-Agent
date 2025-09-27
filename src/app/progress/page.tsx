"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Target,
  BarChart3,
  Check,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react"
import { progressData } from "@/lib/data"

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Progress Overview</h1>
        <p className="text-xl text-muted-foreground">Track your fitness journey and achievements</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">28</div>
            <p className="text-muted-foreground">Total Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">92%</div>
            <p className="text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">12</div>
            <p className="text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground">21h</div>
            <p className="text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weight Lifted Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week's Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span>Completed 5 strength training sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span>Increased deadlift weight by 10lbs</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" />
              <span>Maintained 7-day workout streak</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Week's Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <span>Complete 6 workout sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <span>Increase squat weight by 5lbs</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <span>Try a new exercise variation</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
