import React from "react";
import { StyleSheet } from "react-native";
import { View } from "./view";
import { Text } from "./text";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const cardColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedTextColor = useThemeColor({}, "mutedForeground");

  const getLineWidth = (width: 'short' | 'medium' | 'long') => {
    switch (width) {
      case 'short': return '40%';
      case 'medium': return '70%';
      case 'long': return '90%';
    }
  };

  return (
    <View style={[
      styles.idCardStyle, 
      { backgroundColor: data.backgroundColor || cardColor }
    ]}>
      <View style={styles.idCardHeader}>
        <Text variant="caption" style={[styles.idCardTitle, { color: textColor }]}>
          {data.title}
        </Text>
        {data.subtitle && (
          <Text variant="caption" style={[styles.idCardSubtitle, { color: mutedTextColor }]}>
            {data.subtitle}
          </Text>
        )}
      </View>
      
      <View style={styles.idCardContent}>
        {/* Left side - Person icon */}
        <View style={styles.idCardIconContainer}>
          <View style={styles.personIconCircle}>
            <View style={styles.personIcon}>
              {/* Head */}
              <View style={[styles.personHead, { backgroundColor: textColor }]}></View>
              {/* Body */}
              <View style={[styles.personBody, { backgroundColor: textColor }]}></View>
            </View>
          </View>
        </View>
        
        {/* Right side - Text lines */}
        <View style={styles.idCardTextContainer}>
          {data.textLines.map((line, index) => (
            <View 
              key={index}
              style={[
                styles.textLine, 
                { 
                  width: getLineWidth(line.width),
                  backgroundColor: mutedTextColor + "40" // 25% opacity
                }
              ]}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.idCardFooter}>
        <View style={[styles.idCardChip, { backgroundColor: textColor }]}>
          <Text style={[styles.chipText, { color: data.backgroundColor || cardColor }]}>ID</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  idCardStyle: {
    minHeight: 200,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  idCardHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  idCardTitle: {
    fontSize: 12,
    fontWeight: "700",
    opacity: 0.8,
    letterSpacing: 1,
  },
  idCardSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    opacity: 0.6,
    marginTop: 2,
  },
  idCardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  idCardIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  personIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  personIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  personHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  personBody: {
    width: 32,
    height: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  idCardTextContainer: {
    flex: 2,
    paddingLeft: 20,
    justifyContent: "center",
  },
  textLine: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  idCardFooter: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  idCardChip: {
    backgroundColor: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chipText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});