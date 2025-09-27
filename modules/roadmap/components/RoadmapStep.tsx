import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Linking } from 'react-native';
import { ClipboardList, ExternalLink, LibraryBig, NotebookPen } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface Resource {
  type: 'COURSE' | 'ARTICLE';
  title: string;
  description: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

export interface RoadmapStepProps {
  title: string;
  overview: string;
  skills: string[];
  resources: Resource[];
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
  onNext: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const RoadmapStep: React.FC<RoadmapStepProps> = ({
  title,
  overview,
  skills,
  resources,
  tasks,
  onTaskToggle,
  onNext,
  onPrev,
  isFirst = false,
  isLast = false,
}) => {
  const cardColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMuted = useThemeColor({}, 'textMuted');
  const accentPrimary = useThemeColor({}, 'primary');
  const accentSuccess = useThemeColor({}, 'green');

  const areAllTasksCompleted = tasks.every(task => task.completed);
  const isNextButtonEnabled = areAllTasksCompleted;

  return (
    <View style={{ flex: 1, borderRadius: 12, borderWidth: 1, borderColor: borderColor, backgroundColor: cardColor, paddingHorizontal: 16, paddingVertical: 12 }}>
      {/* Overview Section */}
      <View style={{ marginBottom: 15 }}>
        <Text variant='subtitle' style={{ fontSize: 15, marginBottom: 8 }}>Overview</Text>
        <Text variant='caption' style={{ fontSize: 14.5 }}>{overview}</Text>
      </View>

      {/* Skills Section */}
      <View style={{ flexDirection: 'column', marginBottom: 15 }}>
        <Text variant='subtitle' style={{ fontSize: 15, marginBottom: 8 }}>Skills you&apos;ll gain</Text>
        <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 8 }}>
          {skills.map((skill, index) => (
            <Badge 
              key={index}
              style={{ backgroundColor: `${accentPrimary}14`, paddingVertical: 4 }} 
              textStyle={{ color: accentPrimary, fontSize: 13 }}
            >
              {skill}
            </Badge>
          ))}
        </View>
      </View>

      {/* Tasks Section */}
      <View style={{ flexDirection: 'column', marginBottom: 15 }}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Icon name={ClipboardList} size={18} color={accentSuccess} />
          <Text variant='subtitle' style={{ fontSize: 15, marginBottom: 8 }}>Tasks</Text>
        </View>

        <View style={{ gap: 12 }}>
          {tasks.map((task) => (
            <View 
              key={task.id}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'flex-start', 
                backgroundColor: cardColor, 
                borderRadius: 12, 
                padding: 16, 
                borderWidth: 1, 
                borderColor: borderColor, 
                gap: 12 
              }}
            >
              <View style={{ paddingTop: 2 }}>
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => onTaskToggle(task.id)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text 
                  variant='subtitle' 
                  style={{ 
                    fontSize: 14, 
                    marginBottom: 4, 
                    fontWeight: '600', 
                    textDecorationLine: task.completed ? 'line-through' : 'none', 
                    opacity: task.completed ? 0.6 : 1, 
                    color: task.completed ? textMuted : textColor 
                  }}
                >
                  {task.title}
                </Text>
                <Text variant='caption' style={{ fontSize: 13, color: textMuted }}>{task.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
                  <Icon name={NotebookPen} size={14} color={textMuted} />
                  <Text style={{ fontSize: 12, color: textMuted }}>{task.duration}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Resources Section */}
      <View style={{ flexDirection: 'column', marginBottom: 15, gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 5 }}>
          <Icon name={LibraryBig} size={18} color={accentPrimary} />
          <Text variant='subtitle' style={{ fontSize: 15, marginBottom: 8 }}>Recommended Resources</Text>
        </View>

        {resources.map((resource, index) => {
          const isArticle = resource.type === 'ARTICLE';
          const accentColor = isArticle ? accentSuccess : accentPrimary;
          
          return (
            <TouchableOpacity 
              key={index}
              activeOpacity={0.7}
              onPress={() => {
                console.log(`Opening external ${resource.type.toLowerCase()} link`);
                Linking.openURL(resource.url);
              }}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'flex-start', 
                backgroundColor: `${accentColor}14`, 
                borderRadius: 12, 
                paddingHorizontal: 12, 
                paddingVertical: 18, 
                borderWidth: 1, 
                borderColor: borderColor, 
                gap: 12 
              }}
            >
              <View style={{ alignSelf: 'flex-start' }}>
                <View style={{ padding: 10, borderRadius: 30, backgroundColor: `${accentColor}10` }}>
                  <Icon name={ExternalLink} size={20} color={accentColor} />
                </View>
              </View>

              <View style={{ flex: 1, marginRight: 12, minWidth: 0 }}>
                <Text style={{ fontSize: 12, marginBottom: 5, fontWeight: '600', letterSpacing: 1, color: accentColor }}>
                  {resource.type}
                </Text>
                <Text variant='subtitle' style={{ fontSize: 15, marginBottom: 3 }}>{resource.title}</Text>
                <Text variant='caption' style={{ fontSize: 13.5, color: textColor, flexShrink: 1 }}>{resource.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Navigation Buttons */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: isFirst ? 'flex-end' : 'space-between', 
        gap: 8 
      }}>
        {!isFirst && (
          <TouchableOpacity 
            onPress={onPrev} 
            style={{
              backgroundColor: borderColor,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text style={{
              color: textColor,
              fontSize: 16,
              fontWeight: '600',
            }}>
              ← Prev
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          onPress={isNextButtonEnabled ? onNext : undefined} 
          disabled={!isNextButtonEnabled}
          style={{
            backgroundColor: isNextButtonEnabled ? accentSuccess : textMuted,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: isNextButtonEnabled ? 1 : 0.5,
          }}
        >
          <Text style={{
            color: isNextButtonEnabled ? 'white' : '#999',
            fontSize: 16,
            fontWeight: '600',
          }}>
            {isLast ? 'Completed' : 'Next'} →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoadmapStep;