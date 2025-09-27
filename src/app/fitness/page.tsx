"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dumbbell,
  Mic,
  Check,
  Calendar,
  Clock,
  Zap,
  Plus,
  Download,
  RefreshCw,
  Target,
  Flame,
  Users,
  Info
} from "lucide-react"

// Types
interface Exercise {
  id: number;
  name: string;
  targetReps: number;
  targetSets: number;
  targetWeight: string;
  instructions?: string;
  muscleGroups?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ExerciseData {
  actualReps: string;
  actualWeight: string;
  completed: boolean;
}

interface WorkoutPlan {
  id: string;
  name: string;
  date: string;
  duration: string;
  exercises: Exercise[];
  benefits: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  restBetweenSets?: string;
  warmUpInstructions?: string;
  coolDownInstructions?: string;
}

interface GeneratedWorkouts {
  immediate: WorkoutPlan[];
  weekly: WorkoutPlan[];
  upcoming: WorkoutPlan[];
}

// Default data
const defaultExercises: Exercise[] = [
  {
    id: 1,
    name: "Barbell Bench Press",
    targetReps: 8,
    targetSets: 3,
    targetWeight: "185 lbs",
    instructions: "Lower bar to chest, press up explosively",
    muscleGroups: ["chest", "triceps", "shoulders"],
    difficulty: "intermediate"
  },
  {
    id: 2,
    name: "Squat",
    targetReps: 12,
    targetSets: 4,
    targetWeight: "225 lbs",
    instructions: "Descend until thighs parallel, drive through heels",
    muscleGroups: ["legs", "glutes", "core"],
    difficulty: "intermediate"
  },
  {
    id: 3,
    name: "Deadlift",
    targetReps: 6,
    targetSets: 3,
    targetWeight: "275 lbs",
    instructions: "Keep back straight, lift with legs and hips",
    muscleGroups: ["back", "legs", "core"],
    difficulty: "advanced"
  }
];

const defaultWorkout = {
  date: new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  plan: "Upper Body Strength",
  duration: "60 minutes",
  exercises: 3,
  benefits: "Build upper body strength and muscle mass with compound movements"
};

export default function EnhancedFitnessPage() {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [pendingExercises, setPendingExercises] = useState<Exercise[]>(defaultExercises);
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([]);
  const [generatedWorkouts, setGeneratedWorkouts] = useState<GeneratedWorkouts>({
    immediate: [],
    weekly: [],
    upcoming: []
  });
  const [exerciseData, setExerciseData] = useState<Record<number, ExerciseData>>(
    defaultExercises.reduce(
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
  );
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);

// In real implementation, you'd fetch from /api/get-workouts or similar
      console.log('Loading generated workouts...');
      
    } catch (error) {
      console.error('Error loading generated workouts:', error);
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const handleExerciseUpdate = (exerciseId: number, field: string, value: string | boolean) => {
    setExerciseData((prev) => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value,
      },
    }));
  };

  const handleLogWorkout = (exerciseId: number) => {
    const exercise = pendingExercises.find((ex) => ex.id === exerciseId);
    if (exercise && exerciseData[exerciseId]?.completed) {
      setPendingExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
      setCompletedExercises((prev) => [...prev, exercise]);
    }
  };

  const loadWorkoutPlan = (workoutPlan: WorkoutPlan) => {
    // Reset current state
    setCompletedExercises([]);
    setPendingExercises(workoutPlan.exercises);
    setCurrentWorkout(workoutPlan);
    
    // Initialize exercise data for new workout
    const newExerciseData = workoutPlan.exercises.reduce(
      (acc, exercise) => ({
        ...acc,
        [exercise.id]: {
          actualReps: "",
          actualWeight: "",
          completed: false,
        },
      }),
      {} as Record<number, ExerciseData>,
    );
    setExerciseData(newExerciseData);
  };

  const startVoiceChat = () => {
    console.log("Starting voice chat with AI trainer...");
    // Here you would integrate with Vapi or your voice AI system
    // The conversation would be saved and processed through your API route
    
    // Example integration with Vapi
    // const vapi = new Vapi("your-vapi-key");
    // vapi.start({
    //   assistant: "your-assistant-id",
    //   onCallEnd: async (transcript) => {
    //     // Save transcript and generate workout plan
    //     const response = await fetch('/api/save-transcript', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({
    //         sessionId: `session-${Date.now()}`,
    //         timestamp: new Date().toISOString(),
    //         messages: transcript.messages,
    //         triggerDetected: true,
    //         triggerMessage: "Workout planning completed",
    //         detectedIn: "fitness-chat"
    //       })
    //     });
    //     
    //     if (response.ok) {
    //       // Refresh workout plans
    //       await loadGeneratedWorkouts();
    //       console.log("✅ New workout plans generated!");
    //     }
    //   }
    // });
    
    // For demo purposes, show an alert
    alert("Voice chat would start here! After the conversation, new workout plans will be automatically generated and appear in the AI-Generated Workouts section.");
  };

  const saveWorkoutCompletion = async (workoutPlan: WorkoutPlan, completedExercises: Exercise[], exerciseData: Record<number, ExerciseData>) => {
    try {
      const completionData = {
        workoutId: workoutPlan.id,
        workoutName: workoutPlan.name,
        completedAt: new Date().toISOString(),
        completedExercises: completedExercises.map(exercise => ({
          ...exercise,
          actualReps: exerciseData[exercise.id]?.actualReps || exercise.targetReps.toString(),
          actualWeight: exerciseData[exercise.id]?.actualWeight || exercise.targetWeight,
          completed: exerciseData[exercise.id]?.completed || false
        })),
        totalExercises: workoutPlan.exercises.length,
        completionRate: (completedExercises.length / workoutPlan.exercises.length) * 100
      };

      // Save to localStorage for now, but this could be sent to an API
      const savedCompletions = JSON.parse(localStorage.getItem('workoutCompletions') || '[]');
      savedCompletions.push(completionData);
      localStorage.setItem('workoutCompletions', JSON.stringify(savedCompletions));
      
      console.log('✅ Workout completion saved:', completionData);
      
    } catch (error) {
      console.error('❌ Error saving workout completion:', error);
    }
  };

  // Save completion when workout is finished
  useEffect(() => {
    if (currentWorkout && pendingExercises.length === 0 && completedExercises.length > 0) {
      saveWorkoutCompletion(currentWorkout, completedExercises, exerciseData);
    }
  }, [pendingExercises.length, completedExercises.length, currentWorkout]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMuscleGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      chest: 'bg-blue-100 text-blue-800',
      back: 'bg-purple-100 text-purple-800',
      legs: 'bg-green-100 text-green-800',
      shoulders: 'bg-orange-100 text-orange-800',
      arms: 'bg-pink-100 text-pink-800',
      core: 'bg-yellow-100 text-yellow-800',
      triceps: 'bg-pink-100 text-pink-800',
      glutes: 'bg-emerald-100 text-emerald-800'
    };
    return colors[group] || 'bg-gray-100 text-gray-800';
  };

  const WorkoutPlanCard = ({ workout, onLoad }: { workout: WorkoutPlan; onLoad: () => void }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{workout.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{workout.date}</p>
          </div>
          <Badge variant="outline" className={`${workout.type === 'strength' ? 'border-blue-500 text-blue-700' : 
            workout.type === 'cardio' ? 'border-red-500 text-red-700' : 
            workout.type === 'flexibility' ? 'border-green-500 text-green-700' : 
            'border-purple-500 text-purple-700'}`}>
            {workout.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{workout.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{workout.exercises.length} exercises</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{workout.benefits}</p>
          
          {workout.exercises.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Exercises:</p>
              <div className="flex flex-wrap gap-1">
                {workout.exercises.slice(0, 3).map((exercise) => (
                  <Badge key={exercise.id} variant="secondary" className="text-xs">
                    {exercise.name}
                  </Badge>
                ))}
                {workout.exercises.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{workout.exercises.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <Button onClick={onLoad} className="w-full" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Start This Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Today's Date and Workout Summary */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentWorkout?.date || defaultWorkout.date}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">
          {currentWorkout?.name || defaultWorkout.plan}
        </h1>

        <Card className="border-primary/20 bg-accent/30 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {currentWorkout?.duration || defaultWorkout.duration}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {pendingExercises.length + completedExercises.length} exercises
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {currentWorkout?.type || 'Strength'} Focus
                </span>
              </div>
            </div>
            <p className="text-muted-foreground">
              {currentWorkout?.benefits || defaultWorkout.benefits}
            </p>
            
            {/* Additional workout info */}
            {currentWorkout && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentWorkout.restBetweenSets && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Rest: </span>
                    <span className="font-medium">{currentWorkout.restBetweenSets}</span>
                  </div>
                )}
                {currentWorkout.warmUpInstructions && (
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Warm-up: </span>
                    <span className="font-medium">{currentWorkout.warmUpInstructions}</span>
                  </div>
                )}
              </div>
            )}
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
              Get real-time guidance, motivation, and personalized workout plans. Your AI trainer creates custom workouts based on your conversation!
            </p>
            <Button
              onClick={startVoiceChat}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
            >
              <Mic className="h-5 w-5 mr-2" />
              Start Voice Chat
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Your conversation will generate personalized workout plans automatically
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI-Generated Workouts Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              AI-Generated Workout Plans
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadGeneratedWorkouts}
              disabled={isLoadingWorkouts}
            >
              {isLoadingWorkouts ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="immediate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="immediate">Next Up ({generatedWorkouts.immediate.length})</TabsTrigger>
              <TabsTrigger value="weekly">This Week ({generatedWorkouts.weekly.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({generatedWorkouts.upcoming.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="immediate" className="space-y-4">
              {generatedWorkouts.immediate.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedWorkouts.immediate.map((workout) => (
                    <WorkoutPlanCard 
                      key={workout.id} 
                      workout={workout} 
                      onLoad={() => loadWorkoutPlan(workout)} 
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No immediate workouts available. Chat with your AI trainer to generate personalized workout plans!
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              {generatedWorkouts.weekly.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedWorkouts.weekly.map((workout) => (
                    <WorkoutPlanCard 
                      key={workout.id} 
                      workout={workout} 
                      onLoad={() => loadWorkoutPlan(workout)} 
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No weekly workouts scheduled. Your AI trainer can create a full week of workouts tailored to your goals.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {generatedWorkouts.upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedWorkouts.upcoming.map((workout) => (
                    <WorkoutPlanCard 
                      key={workout.id} 
                      workout={workout} 
                      onLoad={() => loadWorkoutPlan(workout)} 
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No upcoming workouts planned. Your AI trainer can create progressive workout plans for the weeks ahead.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
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
                className={`border shadow-md hover:shadow-lg transition-all duration-200 ${
                  index === 0 ? "ring-2 ring-primary/20 border-primary/30" : ""
                }`}
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
                    {exercise.difficulty && (
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      {exercise.targetReps} reps × {exercise.targetSets} sets @ {exercise.targetWeight}
                    </p>
                    {exercise.instructions && (
                      <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                        💡 {exercise.instructions}
                      </p>
                    )}
                    {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exercise.muscleGroups.map((group) => (
                          <Badge key={group} variant="outline" className={getMuscleGroupColor(group)}>
                            {group}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
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
                    {exercise.difficulty && (
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Target: {exercise.targetReps} reps × {exercise.targetSets} sets @ {exercise.targetWeight}
                  </p>
                  <p className="text-sm text-primary font-medium">
                    Completed: {exerciseData[exercise.id]?.actualReps || exercise.targetReps} reps @{" "}
                    {exerciseData[exercise.id]?.actualWeight || exercise.targetWeight}
                  </p>
                  {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exercise.muscleGroups.map((group) => (
                        <Badge key={group} variant="outline" className={getMuscleGroupColor(group)}>
                          {group}
                        </Badge>
                      ))}
                    </div>
                  )}
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