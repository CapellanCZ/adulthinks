export interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  trend: 'up' | 'down';
}

export interface TipItem {
  icon: React.ReactElement;
  text: string;
  accessibilityLabel: string;
}

export interface HomeScreenUser {
  name: string;
  avatarUrl?: string;
  fallback: string;
}

// constants/homeScreen.ts
import { Calendar, MapPin, Banknote } from 'lucide-react-native';
import { TipItem, TrendingTopic } from '@/types/home';

export const DEFAULT_TIPS = (primaryColor: string): TipItem[] => [
  {
    icon: <Calendar size={16} color={primaryColor} />,
    text: "Book online to avoid long queues.",
    accessibilityLabel: "Tip: Book online to avoid long queues",
  },
  {
    icon: <MapPin size={16} color={primaryColor} />,
    text: "Check office locations & hours beforehand.",
    accessibilityLabel: "Tip: Check office locations and hours beforehand",
  },
  {
    icon: <Banknote size={16} color={primaryColor} />,
    text: "Processing fees range from ₱150-₱500.",
    accessibilityLabel: "Tip: Processing fees range from 150 to 500 pesos",
  },
];

export const DEFAULT_TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: "national-id-fast",
    title: "How to get your National ID fast",
    description: "Tips and requirements for a smooth application.",
    trend: "up",
  },
  {
    id: "sss-id-jobseekers",
    title: "SSS ID for first-time job seekers",
    description: "Why you need it and how to apply.",
    trend: "down",
  },
  {
    id: "postal-id-easiest",
    title: "Postal ID: The easiest valid ID?",
    description: "Step-by-step guide for young adults.",
    trend: "up",
  },
];

export const HOME_SCREEN_CONSTANTS = {
  HEADER_PADDING_TOP: 64