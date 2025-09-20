import * as Haptics from 'expo-haptics';
import { Banknote, Bell, Calendar, MapPin, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import {
  Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList,
  ComboboxTrigger, ComboboxValue, OptionType
} from '@/components/ui/combobox';
import { GovernmentIdCard } from '@/components/ui/government-id-card';
import { ScrollView } from '@/components/ui/scroll-view';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { PHILIPPINE_GOVERNMENT_IDS } from '@/data/philippine-government-ids';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function HomeScreen() {
  const primaryColor = useThemeColor({}, "primary");
  const tipTextColor = useThemeColor({}, "text");
  const trendingTextColor = useThemeColor({}, "text");
  const bottom = useBottomTabBarHeight();

  const [selectedGovernmentId, setSelectedGovernmentId] =
    React.useState<OptionType | null>(null);

  const handleNotificationPress = async () => {
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Add your notification logic here
    console.log("Notification button pressed");
  };

  // TODO: Implement notification, government ID selection and other functionalities
  // TODO: Add navigation to detailed pages
  // TODO: Maintainability, Scalability, Performance, & Separation of Concerns
  // TODO: Refactor large component into smaller, manageable pieces
  // TODO: Separate UI and business logic
  // TODO: optimize styling and theming consistency
  
  return (
    <ScrollView
      style={[styles.scrollView, { paddingHorizontal: 20 }]}
      contentContainerStyle={{ paddingBottom: bottom + 35 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userSection}>
            <Avatar>
              <AvatarImage
                source={{
                  uri: "https://avatars.githubusercontent.com/u/99088394?v=4",
                }}
              />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <View style={styles.userInfo}>
              <Text style={{ fontWeight: "400" }}>
                Hello,
                <Text style={{ fontWeight: "600" }}> John ⛅</Text>
              </Text>
              <Text variant="caption" style={{ fontSize: 14 }}>
                Let&apos;s get you started!
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleNotificationPress}
            android_ripple={{ color: primaryColor + "20", borderless: true }}
            style={({ pressed }) => [
              styles.notificationButton,
              {
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                backgroundColor: pressed ? primaryColor + "10" : "transparent",
              },
            ]}
          >
            <Bell size={24} color={primaryColor} />
          </Pressable>
        </View>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Combobox
          value={selectedGovernmentId}
          onValueChange={setSelectedGovernmentId}
        >
          <ComboboxTrigger>
            <ComboboxValue placeholder="Select government ID  ..." />
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput placeholder="Search government IDs..." />
            <ComboboxList>
              <ComboboxEmpty>No government ID found.</ComboboxEmpty>
              {PHILIPPINE_GOVERNMENT_IDS.map((govId) => (
                <ComboboxItem
                  key={govId.id}
                  value={govId.id}
                  searchValue={`${govId.title} ${govId.subtitle || ""}`}
                >
                  <View style={styles.comboboxItemContent}>
                    <View style={styles.comboboxItemInfo}>
                      <Text style={{ fontWeight: "500" }}>{govId.title}</Text>
                      {govId.subtitle && (
                        <Text
                          variant="caption"
                          style={{ opacity: 0.6, marginTop: 2 }}
                        >
                          {govId.subtitle}
                        </Text>
                      )}
                    </View>
                    <View style={styles.processingBadge}>
                      <Text style={styles.badgeText}>5-7 days</Text>
                    </View>
                  </View>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </View>

      {/* Tips Card*/}
      <View style={{ marginBottom: 20 }}>
        <View>
          <Text variant="title">Essential Tips</Text>
          <Text
            variant="caption"
            style={{
              opacity: 0.7,
              marginBottom: 7,
            }}
          >
            Ensure a smooth application process
          </Text>
        </View>
        <Card style={styles.tipsCard}>
          <CardContent>
            {[
              {
                icon: <Calendar size={16} color={primaryColor} />,
                text: "Book online to avoid long queues.",
              },
              {
                icon: <MapPin size={16} color={primaryColor} />,
                text: "Check office locations & hours beforehand.",
              },
              {
                icon: <Banknote size={16} color={primaryColor} />,
                text: "Processing fees range from ₱150-₱500.",
              },
            ].map((tip, idx) => (
              <React.Fragment key={idx}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {tip.icon}
                  <Text style={[styles.tipText, { color: tipTextColor }]}>
                    {tip.text}
                  </Text>
                </View>
                {idx < 2 && (
                  <Separator style={{ marginVertical: 8, opacity: 0.3 }} />
                )}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
      </View>

      {/* Popular Section */}
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <View>
            <Text variant="title">Popular</Text>
            <Text
              variant="caption"
              style={{
                opacity: 0.7,
                marginBottom: 10,
              }}
            >
              Most applied government IDs
            </Text>
          </View>
          <Pressable onPress={() => console.log("See All pressed")}>
            <Text variant="link" style={{ fontSize: 14 }}>
              See All
            </Text>
          </Pressable>
        </View>

        {/* Carousel of Government ID Cards */}
        <Carousel
          showIndicators={true}
          showArrows={true}
          autoPlay={true}
          loop={true}
          style={{ top: -23, marginBottom: -10 }}
        >
          <CarouselItem
            style={{
              paddingHorizontal: -10,
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          >
            <GovernmentIdCard data={PHILIPPINE_GOVERNMENT_IDS[0]} />
          </CarouselItem>
          <CarouselItem
            style={{
              paddingHorizontal: -10,
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          >
            <GovernmentIdCard data={PHILIPPINE_GOVERNMENT_IDS[1]} />
          </CarouselItem>
          <CarouselItem
            style={{
              paddingHorizontal: -10,
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          >
            <GovernmentIdCard data={PHILIPPINE_GOVERNMENT_IDS[2]} />
          </CarouselItem>
        </Carousel>
      </View>
      
      {/* Trending Section */}
      <View style={{ marginBottom: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text variant="title">Trending</Text>
            <Text
              variant="caption"
              style={{
                opacity: 0.7,
              }}
            >
              Hot topics and discussions
            </Text>
          </View>
          <Pressable onPress={() => console.log("See All pressed")}>
            <Text variant="link" style={{ fontSize: 14 }}>
              See All
            </Text>
          </Pressable>
        </View>
        <Card style={{ borderRadius: 10, marginTop: 8 }}>
          <CardContent>
            {[
              {
                title: "How to get your National ID fast",
                description: "Tips and requirements for a smooth application.",
                trend: "up",
              },
              {
                title: "SSS ID for first-time job seekers",
                description: "Why you need it and how to apply.",
                trend: "down",
              },
              {
                title: "Postal ID: The easiest valid ID?",
                description: "Step-by-step guide for young adults.",
                trend: "up",
              },
            ].map((topic, idx) => (
              <View key={idx} style={{ marginBottom: idx < 2 ? 16 : 0 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center", // Changed from "flex-start" to "center"
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center", // Center the icon vertically
                      alignItems: "center", // Center the icon horizontally
                      minHeight: 20, // Ensure consistent height
                    }}
                  >
                    {topic.trend === "up" ? (
                      <TrendingUp size={18} color={primaryColor} />
                    ) : (
                      <TrendingDown size={18} color={primaryColor} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: trendingTextColor,
                        fontSize: 15,
                      }}
                    >
                      {topic.title}
                    </Text>
                    <Text
                      variant="caption"
                      style={{
                        marginTop: 2,
                        fontSize: 13,
                      }}
                    >
                      {topic.description}
                    </Text>
                  </View>
                </View>
                {idx < 2 && (
                  <Separator style={{ marginVertical: 10, opacity: 0.1 }} />
                )}
              </View>
            ))}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tipsCard: {
    borderRadius: 10,
  },
  comboboxItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  comboboxItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  processingBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#1976d2",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
  },
});
