import React from 'react';
import { StyleSheet } from 'react-native';
import { Calendar, MapPin, Banknote } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useThemeColor } from '@/hooks/useThemeColor';

interface TipItem {
  icon: React.ReactElement;
  text: string;
  accessibilityLabel: string;
}

interface EssentialTipsProps {
  title?: string;
  subtitle?: string;
}

export const EssentialTips: React.FC<EssentialTipsProps> = ({
  title = "Essential Tips",
  subtitle = "Ensure a smooth application process",
}) => {
  const primaryColor = useThemeColor({}, "primary");
  const tipTextColor = useThemeColor({}, "text");

  const tips: TipItem[] = [
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="title">{title}</Text>
        <Text
          variant="caption"
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
      </View>
      
      <Card 
        style={styles.tipsCard}
      >
        <CardContent>
          {tips.map((tip, idx) => (
            <React.Fragment key={idx}>
              <View
                style={styles.tipRow}
                accessible={true}
                accessibilityLabel={tip.accessibilityLabel}
                accessibilityRole="text"
              >
                <View style={styles.iconContainer}>
                  {tip.icon}
                </View>
                <Text style={[styles.tipText, { color: tipTextColor }]}>
                  {tip.text}
                </Text>
              </View>
              {idx < tips.length - 1 && (
                <Separator style={styles.separator} />
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginBottom: 7,
  },
  subtitle: {
    opacity: 0.7,
  },
  tipsCard: {
    borderRadius: 10,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    minWidth: 16,
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    marginVertical: 8,
    opacity: 0.3,
  },
});