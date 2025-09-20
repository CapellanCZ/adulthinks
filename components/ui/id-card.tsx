import React from "react";
import { Dimensions } from "react-native";
import { View } from "./view";
import { Text } from "./text";

const { width } = Dimensions.get("window");

interface IDCardProps {
  /**
   * The title text displayed on the card (e.g., "ID Card", "Student ID", etc.)
   */
  title?: string;
  /**
   * Background color of the card
   */
  backgroundColor?: string;
  /**
   * Width of the card as a percentage of screen width (0.1 to 1.0)
   */
  widthPercentage?: number;
  /**
   * Custom style overrides
   */
  style?: object;
  /**
   * Whether to show the avatar circle
   */
  showAvatar?: boolean;
  /**
   * Avatar background color
   */
  avatarColor?: string;
  /**
   * Text color for the title and elements
   */
  textColor?: string;
  /**
   * Corner radius of the card
   */
  borderRadius?: number;
}

export const IDCard: React.FC<IDCardProps> = ({
  title = "ID Card",
  backgroundColor = "#4169E1", // Royal Blue
  widthPercentage = 0.85,
  style = {},
  showAvatar = true,
  avatarColor = "#FFFFFF",
  textColor = "#FFFFFF",
  borderRadius = 16,
}) => {
  const cardWidth = width * widthPercentage;
  const cardHeight = cardWidth * 0.63; // Credit card aspect ratio (1.586:1)
  
  // Responsive sizes based on card width
  const avatarSize = cardWidth * 0.12;
  const avatarInnerSize = avatarSize * 0.7;
  const fontSize = cardWidth * 0.045;
  const chipWidth = cardWidth * 0.07;
  const chipHeight = chipWidth * 0.8;
  const lineHeight = Math.max(10, cardWidth * 0.006);
  const lineGap = Math.max(4, cardWidth * 0.012);

  return (
    <View style={[
      // Card base styles
      {
        width: cardWidth,
        height: cardHeight,
        backgroundColor,
        borderRadius,
        padding: cardWidth * 0.06,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        justifyContent: "space-between",
      },
      style
    ]}>
      {/* Top Section with Avatar and Title */}
      <View style={{
        alignItems: "center",
        paddingTop: cardHeight * 0.08,
      }}>
        {showAvatar && (
          <View style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: avatarColor,
            marginBottom: cardHeight * 0.05,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}>
            <View style={{
              width: avatarInnerSize,
              height: avatarInnerSize,
              borderRadius: avatarInnerSize / 2,
              backgroundColor: backgroundColor,
              opacity: 0.3,
            }} />
          </View>
        )}
        
        <Text style={{
          fontSize,
          color: textColor,
          fontWeight: "600",
          textAlign: "center",
        }}>{title}</Text>
      </View>

      {/* Middle Section with Lines */}
      <View style={{
        width: "100%",
        paddingLeft: cardWidth * 0.02,
        paddingTop: cardHeight * 0.08,
      }}>
        {/* First line (longest) */}
        <View style={{
          width: cardWidth * 0.65,
          height: lineHeight + 1,
          backgroundColor: textColor,
          opacity: 0.4,
          borderRadius: 5,
          marginBottom: lineGap,
        }} />
        
        {/* Second line (medium) */}
        <View style={{
          width: cardWidth * 0.4,
          height: lineHeight,
          backgroundColor: textColor,
          opacity: 0.4,
          borderRadius: 5,
          marginBottom: lineGap,
        }} />
        
        {/* Third line (shortest) */}
        <View style={{
          width: cardWidth * 0.5,
          height: lineHeight,
          backgroundColor: textColor,
          opacity: 0.4,
          borderRadius: 5,
          marginBottom: lineGap,
        }} />
        {/* Fourth line (shortest) */}
        <View style={{
          width: cardWidth * 0.2,
          height: lineHeight,
          backgroundColor: textColor,
          opacity: 0.4,
          borderRadius: 5,
        }} />
      </View>

      {/* Bottom Section with Chip */}
      <View style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingBottom: cardHeight * 0.04,
      }}>
        <View style={{
          width: chipWidth,
          height: chipHeight,
          backgroundColor: 'transparent',
          borderWidth: Math.max(1.5, cardWidth * 0.005),
          borderColor: textColor,
          borderRadius: 4,
          opacity: 0.5,
        }} />
      </View>
    </View>
  );
};

export default IDCard;