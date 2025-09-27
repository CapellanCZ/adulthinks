import React, { useState, useMemo, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft, MapPin, Clock, Award, ArrowRight } from 'lucide-react-native'
import { router } from 'expo-router'
import { Text } from '@/components/ui/text'
import { View } from '@/components/ui/view'
import { useThemeColor } from '@/hooks/useThemeColor';
import ProgressSteps, { Title, Content } from '@joaosousa/react-native-progress-steps';
import { Icon } from '@/components/ui/icon';
import { ScrollView } from '@/components/ui/scroll-view'
import { TouchableOpacity } from 'react-native'
import { RoadmapStep } from '@/modules/roadmap/components/RoadmapStep'
import { ProgressRingChart } from '@/components/charts/progress-ring-chart'

// Local types for this screen
 type MilestoneTask = {
   id: string;
   title: string;
   description: string;
   duration: string;
   completed: boolean;
 };
 
 type MilestoneResource = {
   type: 'COURSE' | 'ARTICLE';
   title: string;
   description: string;
   url: string;
 };
 
 interface Milestone {
   id: string;
   title: string;
   overview: string;
   skills: string[];
   timeframe: string;
   resources: MilestoneResource[];
   tasks: MilestoneTask[];
 }

export default function RoadmapDetailsRevise() {
    const backgroundColor = useThemeColor({}, 'background');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');
    const textMuted = useThemeColor({}, 'textMuted');
    const accentPrimary = useThemeColor({}, 'primary');
    const secondaryColor = useThemeColor({}, 'secondary');

    const [step, setStep] = useState<number>(0);

    // Define milestones data
    const [milestones, setMilestones] = useState<Milestone[]>([
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
        },
        {
            id: "milestone-4",
            title: "Projects",
            overview: "Apply what you’ve learned by building small, practical projects. Create a portfolio that shows your skills to employers.",
            skills: ["Portfolio", "Problem-solving"],
            timeframe: "Month 7",
            resources: [
                { type: "COURSE", title: "Build Responsive Websites", description: "A project-based course on modern web design. It helps you create professional portfolio pieces.", url: "https://example.com/responsive-web" },
                { type: "ARTICLE", title: "How to Build Your Programming Portfolio", description: "Shares strategies to create a strong portfolio. It explains what projects to include and why.", url: "https://example.com/programming-portfolio" },
            ],
            tasks: [
                { id: "task-4-1", title: "Design a simple personal portfolio webpage", description: "Plan layout, sections, and add basic styling", duration: "2 hours", completed: false },
                { id: "task-4-2", title: "Add at least 2 small projects (calculator, to-do list app)", description: "Implement and showcase functionality", duration: "2 hours", completed: false },
                { id: "task-4-3", title: "Read the article and list 3 portfolio improvements you can make", description: "Create an actionable improvement list", duration: "1 hour", completed: false },
            ],
        },
        {
            id: "milestone-5",
            title: "Interview Preperation",
            overview: "Prepare for job interviews by practicing technical questions and improving communication skills. Learn to present your skills clearly.",
            skills: ["Communication", "Technical prep"],
            timeframe: "Month 8",
            resources: [
                { type: "COURSE", title: "Cracking the Coding Interview Prep", description: "Covers coding problems commonly asked in IT jobs. It helps you practice with real examples.", url: "https://example.com/cci-prep" },
                { type: "ARTICLE", title: "Top IT Interview Questions", description: "Lists common questions from employers. It helps you get familiar with what to expect.", url: "https://example.com/it-interview-questions" },
            ],
            tasks: [
                { id: "task-5-1", title: "Solve 3 coding practice problems", description: "Pick problems of varying difficulty and solve them", duration: "2 hours", completed: false },
                { id: "task-5-2", title: "Record yourself answering 3 common interview questions", description: "Focus on clarity and structure", duration: "1.5 hours", completed: false },
                { id: "task-5-3", title: "Review the article and prepare written answers for 5 questions", description: "Draft concise answers in your own words", duration: "1 hour", completed: false },
            ],
        },
        {
            id: "milestone-6",
            title: "Job Applications",
            overview: "Start applying for internships or entry-level jobs. Build a strong resume and learn effective application strategies.",
            skills: ["Resume", "Applications"],
            timeframe: "Month 9",
            resources: [
                { type: "COURSE", title: "Career Success Specialization", description: "A practical guide to resumes, LinkedIn, and applications. It prepares you to present your skills well.", url: "https://example.com/career-success" },
                { type: "ARTICLE", title: "How to Land Your First IT Job", description: "Offers advice for beginners entering IT. It gives tips on networking and applying smartly.", url: "https://example.com/first-it-job" },
            ],
            tasks: [
                { id: "task-6-1", title: "Write a one-page resume tailored for IT jobs", description: "Highlight relevant skills and projects", duration: "2 hours", completed: false },
                { id: "task-6-2", title: "Create or update a LinkedIn profile with skills and projects", description: "Ensure completeness and professionalism", duration: "1.5 hours", completed: false },
                { id: "task-6-3", title: "Research and apply to 3 internship postings", description: "Tailor applications for each posting", duration: "2 hours", completed: false },
            ],
        },
        {
            id: "milestone-7",
            title: "Certifications & Growth",
            overview: "Strengthen your career with certifications and real-world experience. Gain credentials that prove your expertise.",
            skills: ["Certification", "Experience"],
            timeframe: "Month 10-12",
            resources: [
                { type: "COURSE", title: "CompTIA A+ Certification", description: "Industry-recognized entry-level certification. It proves knowledge in hardware, software, and troubleshooting.", url: "https://example.com/comptia-aplus" },
                { type: "ARTICLE", title: "Top IT Certifications for Beginners", description: "Lists certifications valued by employers. It helps you choose the right starting point.", url: "https://example.com/top-it-certs" },
            ],
            tasks: [
                { id: "task-7-1", title: "Study 1 module from the CompTIA A+ course and take notes", description: "Focus on understanding and retention", duration: "2 hours", completed: false },
                { id: "task-7-2", title: "Take a practice quiz from certification prep material", description: "Evaluate your readiness", duration: "1.5 hours", completed: false },
                { id: "task-7-3", title: "Read the article and select one certification to pursue next", description: "Decide based on your career path", duration: "1 hour", completed: false },
            ],
        },
    ]);

    // Function to toggle task completion (immutable update, with auto-advance when milestone completed)
    const toggleTask = (milestoneIndex: number, taskId: string): void => {
        setMilestones((prev) => {
            const updated = prev.map((ms, i) =>
                i !== milestoneIndex
                    ? ms
                    : {
                        ...ms,
                        tasks: ms.tasks.map((t) =>
                            t.id === taskId ? { ...t, completed: !t.completed } : t
                        ),
                    }
            );
    
            // If all tasks in the toggled milestone are completed, auto-advance to next step
            const allCompleted = updated[milestoneIndex]?.tasks.every((t) => t.completed);
            if (allCompleted) {
                setStep((s) => Math.min(milestoneIndex + 1, updated.length - 1));
            }
    
            return updated;
        });
    };

    // Function to handle next step
    const handleNext = useCallback(() => {
        setStep((s) => Math.min(s + 1, milestones.length - 1));
    }, [milestones.length]);

    // Function to handle previous step
    const handlePrev = useCallback(() => {
        setStep((s) => Math.max(s - 1, 0));
    }, []);

    // Generate steps for the progress stepper with inline content
    const progressSteps = useMemo(
        () =>
            milestones.map((milestone, index) => ({
                id: index, // 0-based to align with currentStep
                title: <Title>{milestone.title.split(':')[0]}</Title>,
                content: (
                    <Content>
                        <RoadmapStep
                            title={milestone.title}
                            overview={milestone.overview}
                            skills={milestone.skills}
                            resources={milestone.resources} 
                            tasks={milestone.tasks}
                            onTaskToggle={(taskId) => toggleTask(index, taskId)}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            isFirst={index === 0}
                            isLast={index === milestones.length - 1}
                        />
                    </Content>
                ),
            })),
        [milestones, handleNext, handlePrev]
    );

    const progressSummary = useMemo(() => {
        const totalTasks = milestones.reduce((acc, m) => acc + m.tasks.length, 0);
        const completedTasks = milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
        const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return { totalTasks, completedTasks, progressPct };
    }, [milestones]);

    const nextMilestoneIndex = useMemo(() => {
        const idx = milestones.findIndex(ms => !ms.tasks.every(t => t.completed));
        return idx === -1 ? milestones.length - 1 : idx;
    }, [milestones]);

    const skillTags = useMemo(() => {
        const set = new Set<string>();
        milestones.forEach(ms => ms.skills.forEach(sk => set.add(sk)));
        return Array.from(set).slice(0, 4);
    }, [milestones]);

    const handleContinue = useCallback(() => {
        setStep(nextMilestoneIndex);
    }, [nextMilestoneIndex]);

    // Milestone stats for compact top card
    const milestoneStats = useMemo(() => {
        const totalMs = milestones.length;
        const completedMs = milestones.filter(ms => ms.tasks.length > 0 && ms.tasks.every(t => t.completed)).length;
        const pct = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;
        return { totalMs, completedMs, pct };
    }, [milestones]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor }}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: backgroundColor,
                }}
            >
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <ArrowLeft size={24} />
                </TouchableOpacity>

                <Text variant='title' style={{ textAlign: 'center', flex: 1 }}>
                    Roadmap
                </Text>

                <View style={{ width: 32 }} />
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
                <View
                    style={{
                        backgroundColor: cardColor,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: borderColor,
                    }}
                >
                    {/* Light-mode progress card header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: '700', color: textColor, marginBottom: 2 }}>IT Career Roadmap</Text>
                            <Text style={{ fontSize: 13, color: textMuted, opacity: 0.7 }}>Your Progress</Text>
                        </View>
                        <Text style={{ fontSize: 32, fontWeight: '800', color: accentPrimary, lineHeight: 36 }}>
                            {progressSummary.progressPct}
                            <Text style={{ fontSize: 16, color: textMuted, fontWeight: '500' }}>%</Text>
                        </Text>
                    </View>

                    {/* Progress bar */}
                    <View style={{ 
                        height: 10, 
                        backgroundColor: `${accentPrimary}12`, 
                        borderRadius: 6, 
                        overflow: 'hidden', 
                        marginBottom: 20 
                    }}>
                        <View style={{ 
                            width: `${progressSummary.progressPct}%`, 
                            backgroundColor: accentPrimary, 
                            height: '100%',
                            borderRadius: 6
                        }} />
                    </View>

                    {/* Stats row: Tasks and Milestones */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 24 }}>
                        {/* Tasks */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginRight: 16 }}>
                                <ProgressRingChart 
                                    progress={progressSummary.totalTasks ? (progressSummary.completedTasks / progressSummary.totalTasks) * 100 : 0} 
                                    size={64} 
                                    strokeWidth={6}
                                    config={{ animated: true, duration: 800 }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, color: textMuted, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }}>Tasks</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={{ fontSize: 28, fontWeight: '800', color: textColor, lineHeight: 32 }}>
                                        {progressSummary.completedTasks}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: textMuted, marginLeft: 6, fontWeight: '600' }}>
                                        /{progressSummary.totalTasks}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 12, color: textMuted, marginTop: 2, fontWeight: '500', opacity: 0.8 }}>
                                    completed
                                </Text>
                            </View>
                        </View>

                        {/* Milestones */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginRight: 16 }}>
                                <ProgressRingChart 
                                    progress={milestoneStats.pct} 
                                    size={64} 
                                    strokeWidth={6}
                                    config={{ animated: true, duration: 1000 }}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, color: textMuted, marginBottom: 8, fontWeight: '700', letterSpacing: 0.5 }}>Steps</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={{ fontSize: 28, fontWeight: '800', color: textColor, lineHeight: 32 }}>
                                        {milestoneStats.completedMs}
                                    </Text>
                                    <Text style={{ fontSize: 16, color: textMuted, marginLeft: 6, fontWeight: '600' }}>
                                        /{milestoneStats.totalMs}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 12, color: textMuted, marginTop: 2, fontWeight: '500', opacity: 0.8 }}>
                                    completed
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <ProgressSteps
                    currentStep={step}
                    steps={progressSteps}
                    colors={{
                        title: {
                            text: {
                                normal: textColor,
                                active: accentPrimary,
                                completed: accentPrimary,
                            },
                        },
                        marker: {
                            text: {
                                normal: textColor,
                                active: accentPrimary,
                                completed: accentPrimary,
                            },
                            line: {
                                normal: borderColor,
                                active: accentPrimary,
                                completed: accentPrimary,
                            },
                        },
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
