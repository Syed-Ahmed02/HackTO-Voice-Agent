"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Mic,
  BookOpen,
  Calendar,
} from "lucide-react"
import { diaryEntries, todaysWorkout } from "@/lib/data"

export default function DiaryPage() {
  const startVoiceChat = () => {
    // Placeholder for Vapi integration
    console.log("Starting voice chat with AI health coach...")
  }

  return (
    <div className="space-y-6">
      {/* Today's Date and Diary Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">{todaysWorkout.date}</span>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Daily Diary</h1>

        <Card className="border-primary/20 bg-accent/30 mb-6">
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Share your thoughts, feelings, and experiences. Your AI coach will analyze your entries to provide
              personalized recommendations for your fitness and nutrition journey.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Voice Agent Interface - Main Feature */}
      <Card className="border-primary/30 bg-primary/5 mb-8">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
                <Mic className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Talk to Your AI Health Coach</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Share how you're feeling today. Your AI coach will adjust your nutrition and workout plans based on your
              daily experiences.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={startVoiceChat}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Voice Entry
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg bg-transparent">
                <BookOpen className="h-5 w-5 mr-2" />
                Write Entry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Diary Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries & AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {diaryEntries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-primary pl-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{entry.date}</p>
                    <p className="text-sm text-muted-foreground">{entry.time}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{entry.mood}</span>
                </div>

                <p className="text-muted-foreground italic">"{entry.entry}"</p>

                <div className="bg-accent/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">AI Recommendations:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {entry.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
