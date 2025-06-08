"use client"

import { Calendar, BarChart3, Tag, GraduationCap, Briefcase, Dumbbell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Subject {
  id: string
  name: string
  category: "school" | "work" | "fitness" | "custom"
  createdAt: Date
  templateId: string
}

interface WelcomeScreenProps {
  onAddSubject: () => void
  onTemplateSelect: (template: {
    icon: any
    title: string
    subtitle: string
    examples: string
    category: Subject["category"]
    color: string
    bgColor: string
  }) => void
  onGetStarted?: () => void
}

export function WelcomeScreen({ onAddSubject, onTemplateSelect, onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar",
      description: "Visual calendar with attendance tracking",
      color: "text-blue-500",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Get insights and attendance percentage",
      color: "text-purple-500",
    },
    {
      icon: Tag,
      title: "Custom Tags",
      description: "Present, Absent, Half-day & more",
      color: "text-green-500",
    },
  ]

  const templates = [
    {
      icon: GraduationCap,
      title: "School/College",
      subtitle: "Track class attendance",
      examples: "Math, Physics, Chemistry",
      category: "school" as const,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Briefcase,
      title: "Work",
      subtitle: "Track work attendance",
      examples: "Office, Meetings, Projects",
      category: "work" as const,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Dumbbell,
      title: "Fitness",
      subtitle: "Track workout sessions",
      examples: "Gym, Running, Yoga",
      category: "fitness" as const,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Plus,
      title: "Custom",
      subtitle: "Create your own",
      examples: "Your choice",
      category: "custom" as const,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <main className="flex-1 p-4 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center mb-8 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Welcome to Your Attendance Tracker
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Track your subjects, work, or tasks with ease. Get insights into your attendance patterns and stay organized.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Quick Start</h2>
        <p className="text-gray-600">Choose a template or create your own</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {templates.map((template, index) => (
          <button key={index} className="text-left focus:outline-none group" onClick={() => onTemplateSelect(template)}>
            <div className="border rounded-lg p-6 h-full flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:border-blue-300 active:scale-95 group-focus:ring-2 group-focus:ring-blue-500">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${template.bgColor} mb-4 transition-transform group-hover:scale-110`}
              >
                <template.icon className={`w-8 h-8 ${template.color}`} />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1 text-lg">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{template.subtitle}</p>
              <p className="text-xs text-blue-600">{template.examples}</p>
            </div>
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mb-8">
        <Button
          onClick={onAddSubject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Your First Subject or Task
        </Button>
        <p className="text-gray-500 text-sm mt-2">Start tracking your attendance today</p>
      </div>

      {/* How It Works Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">See How It Works</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-r from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Mathematics</h3>
                  <p className="text-sm text-gray-600">Class attendance</p>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">85%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Office Work</h3>
                  <p className="text-sm text-gray-600">Work attendance</p>
                </div>
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">92%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Get Started Button for existing users */}
      {onGetStarted && (
        <div className="text-center">
          <Button onClick={onGetStarted} variant="outline" className="px-8 py-3 text-lg">
            Go to Dashboard
          </Button>
        </div>
      )}
    </main>
  )
}
