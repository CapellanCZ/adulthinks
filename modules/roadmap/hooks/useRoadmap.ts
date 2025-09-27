import { useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Milestone } from '../types'

// Sample milestone data for generated roadmap
const sampleMilestones: Milestone[] = [
  {
    id: "milestone-1",
    title: "IT Fundamentals",
    overview: "Learn the core of IT including hardware, software, networking, and databases. This builds your foundation for advanced skills.",
    skills: ["Hardware basics", "Networking"],
    timeframe: "Month 1-2",
    resources: [
      {
        type: "COURSE",
        title: "Introduction to Computer Science",
        description: "A beginner-friendly course that covers hardware, software, and data. It's designed to give you a strong IT foundation.",
        url: "https://example.com/course"
      },
      {
        type: "ARTICLE",
        title: "What is Networking?",
        description: "A simple guide that explains how networks work. It introduces key terms like IP, routers, and connections.",
        url: "https://example.com/networking-article"
      }
    ],
    tasks: [
      {
        id: "task-1-1",
        title: "Watch a lecture on hardware components and summarize key functions",
        description: "Take notes on CPU, RAM, storage, and motherboard functions",
        duration: "1 hour",
        completed: false
      },
      {
        id: "task-1-2",
        title: "Create a simple diagram of a basic computer network",
        description: "Include router, switches, devices, and connection types",
        duration: "1.5 hours",
        completed: false
      },
      {
        id: "task-1-3",
        title: "Read the article and list 5 key networking terms with definitions",
        description: "Focus on IP address, router, switch, LAN, and WAN",
        duration: "1 hour",
        completed: false
      }
    ]
  },
  {
    id: "milestone-2",
    title: "Programming Basics",
    overview: "Understand coding structure, logic, and how to solve problems with simple programs. This sets the stage for real development.",
    skills: ["Syntax", "Algorithms"],
    timeframe: "Month 3-4",
    resources: [
      {
        type: "COURSE",
        title: "Python for Beginners",
        description: "Teaches coding from scratch using Python. It walks you through logic, syntax, and basic programs.",
        url: "https://example.com/python-beginners"
      },
      {
        type: "ARTICLE",
        title: "How to Think Like a Programmer",
        description: "Explains how to approach coding problems. It focuses on logical steps and problem-solving habits.",
        url: "https://example.com/think-programmer"
      }
    ],
    tasks: [
      {
        id: "task-2-1",
        title: "Write a Python program that prints \"Hello World\" and test it",
        description: "Create, save, and run your first Python script",
        duration: "1 hour",
        completed: false
      },
      {
        id: "task-2-2",
        title: "Practice writing 3 simple algorithms (sorting, sum, search)",
        description: "Implement bubble sort, array sum, and linear search algorithms",
        duration: "2 hours",
        completed: false
      },
      {
        id: "task-2-3",
        title: "Read the article and apply one problem-solving step to a coding exercise",
        description: "Choose one method from the article and use it to solve a simple problem",
        duration: "1.5 hours",
        completed: false
      }
    ]
  },
  {
    id: "milestone-3",
    title: "Specialization",
    overview: "Focus on an area like web development, cybersecurity, or cloud computing. Gain targeted skills to match your career path.",
    skills: ["Web dev", "Security"],
    timeframe: "Month 5-6",
    resources: [
      {
        type: "COURSE",
        title: "Web Development Bootcamp",
        description: "Covers HTML, CSS, and JavaScript for websites. It also introduces backend tools for full projects.",
        url: "https://example.com/web-dev"
      },
      {
        type: "ARTICLE",
        title: "What is Cybersecurity?",
        description: "Explains the basics of protecting systems and data. It introduces risks and simple defense strategies.",
        url: "https://example.com/cybersecurity"
      }
    ],
    tasks: [
      {
        id: "task-3-1",
        title: "Build a simple static webpage with HTML and CSS",
        description: "Create a personal profile page with styling",
        duration: "2 hours",
        completed: false
      },
      {
        id: "task-3-2",
        title: "Follow a tutorial on web security basics and note common threats",
        description: "Learn about XSS, CSRF, and SQL injection attacks",
        duration: "1.5 hours",
        completed: false
      },
      {
        id: "task-3-3",
        title: "Read the article and write a 1-page summary of cybersecurity essentials",
        description: "Cover key concepts and basic protection strategies",
        duration: "1 hour",
        completed: false
      }
    ]
  }
]

export function useRoadmap() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(false)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  const textMuted = useThemeColor({}, 'textMuted')
  const primaryColor = useThemeColor({}, 'primary')

  const handleGenerateRoadmap = () => {
    setIsModalVisible(true)
  }

  const handleFabPress = () => {
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  const handleCreateRoadmap = () => {
    // Simulate roadmap generation
    setMilestones(sampleMilestones)
    setHasGeneratedRoadmap(true)
    setIsModalVisible(false)
  }

  const handleBackToWelcome = () => {
    setHasGeneratedRoadmap(false)
    setMilestones([])
  }

  return {
    colors: {
      backgroundColor,
      borderColor,
      textColor,
      textMuted,
      primaryColor,
    },
    handlers: {
      handleGenerateRoadmap,
      handleFabPress,
      handleCloseModal,
      handleBackToWelcome,
      handleCreateRoadmap,
    },
    modal: {
      isModalVisible,
    },
    roadmapState: {
      hasGeneratedRoadmap,
      milestones,
    },
  }
}
