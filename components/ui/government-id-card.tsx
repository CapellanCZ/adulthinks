import React from "react";
import { View } from "./view";
import { Text } from "./text";
import { Card } from "./card";
import { useThemeColor } from "@/hooks/useThemeColor";
import { User } from "lucide-react-native";
import { Separator } from "./separator";

export interface GovernmentIdData {
  id: string;
  title: string;
  subtitle?: string;
  backgroundColor?: string;
  textLines: {
    width: 'short' | 'medium' | 'long';
  }[];
}

interface GovernmentIdCardProps {
  data: GovernmentIdData;
  onPress?: () => void;
}

export const GovernmentIdCard: React.FC<GovernmentIdCardProps> = ({ 
  data, 
  onPress 
}) => {
  // Theme-driven colors
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "textMuted");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");
  const iconBgColor = useThemeColor({}, "popover");

  // Minimalist iOS-inspired config
  const iconSize = 38;
  const iconColor = primaryColor;

  const getLineWidth = (width: 'short' | 'medium' | 'long') => {
    switch (width) {
      case 'short': return '50%';
      case 'medium': return '75%';
      case 'long':
      default: return '100%';
    }
  };

  return (
    <Card style={{ borderRadius: 10, padding: 18, borderWidth: 1, borderColor: borderColor + "10", backgroundColor: cardColor }}>
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 15 }}>
        <Text variant="title" style={{ fontSize: 15, opacity: 0.9, color: textColor, textAlign: "center" }}>
          {data.title}
        </Text>
        {data.subtitle && (
          <Text variant="caption" style={{ fontSize: 11, opacity: 0.7, marginTop: 4, color: textColor, textAlign: "center" }}>
            {data.subtitle}
          </Text>
        )}
        <Separator style={{ marginTop: 15, opacity: 0.2, backgroundColor: borderColor }} />
      </View>

      {/* Content */}
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 8 }}>
        {/* Left: Lucide User icon */}
        <View style={{ alignItems: "center", justifyContent: "center", marginRight: 20 }}>
          <View style={{
            width: 70,
            height: 70,
            borderRadius: 15,
            backgroundColor: iconBgColor,
            alignItems: "center",
            justifyContent: "center",
          }}>
            <User size={iconSize} color={iconColor} />
          </View>
        </View>
        {/* Right: Text lines */}
        <View style={{ flex: 1, justifyContent: "center", marginTop: 10 }}>
          {data.textLines.slice(0, 4).map((line, lineIndex) => (
            <View
              key={lineIndex}
              style={{
                height: 7,
                borderRadius: 3,
                marginBottom: 15,
                backgroundColor: mutedColor,
                opacity: 0.3,
                width: getLineWidth(line.width),
              }}
            />
          ))}
        </View>
      </View>
    </Card>
  );
};

// Styles removed; now using Card and Text components for maintainability and theme-driven design