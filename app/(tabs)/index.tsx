import React from "react";
import * as Haptics from "expo-haptics";
import { Bell } from "lucide-react-native";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { GovernmentIdCard } from "@/components/ui/government-id-card-simple";
import { PHILIPPINE_GOVERNMENT_IDS } from "@/data/philippine-government-ids";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  OptionType,
} from "@/components/ui/combobox";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const bottom = useBottomTabBarHeight();
  const router = useRouter();

  const [selectedGovernmentId, setSelectedGovernmentId] = React.useState<OptionType | null>(null);

  const primaryColor = useThemeColor({}, "primary");

  const handleNotificationPress = async () => {
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Add your notification logic here
    console.log("Notification button pressed");
  };

  const handleIdCardPress = async (idData: any) => {
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to ID card details screen
    router.push({
      pathname: '/id-card-details',
      params: {
        id: idData.id,
        title: idData.title,
        subtitle: idData.subtitle || '',
      }
    });
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ paddingBottom: bottom }}
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

      {/* Government ID Selection */}
      <View style={styles.gettingStartedSection}>
       
        <Combobox 
          value={selectedGovernmentId} 
          onValueChange={setSelectedGovernmentId}
        >
          <ComboboxTrigger>
            <ComboboxValue placeholder="Select government ID..." />
          </ComboboxTrigger>
          <ComboboxContent>
            <ComboboxInput placeholder="Search government IDs..." />
            <ComboboxList>
              <ComboboxEmpty>No government ID found.</ComboboxEmpty>
              {PHILIPPINE_GOVERNMENT_IDS.map((govId) => (
                <ComboboxItem
                  key={govId.id}
                  value={govId.id}
                  searchValue={`${govId.title} ${govId.subtitle || ''}`}
                >
                  <View>
                    <Text style={{ fontWeight: '500' }}>{govId.title}</Text>
                    {govId.subtitle && (
                      <Text variant="caption" style={{ opacity: 0.6, marginTop: 2 }}>
                        {govId.subtitle}
                      </Text>
                    )}
                  </View>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </View>

      {/* Philippine Government IDs Section */}
      <View style={styles.cardsSection}>
        <Text variant="title" style={styles.sectionTitle}>
          Philippine Government IDs
        </Text>
        <Text variant="caption" style={styles.sectionSubtitle}>
          Swipe to explore different government-issued identification cards
        </Text>

        <Carousel
          showIndicators={true}
          showArrows={true}
          autoPlay={true}
          loop={true}
        >
          {PHILIPPINE_GOVERNMENT_IDS.map((idData, index) => (
            <CarouselItem key={idData.id}>
              <Pressable
                onPress={() => handleIdCardPress(idData)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <GovernmentIdCard data={idData} />
              </Pressable>
            </CarouselItem>
          ))}
        </Carousel>

        <Text variant="caption" style={styles.carouselHint}>
          Tap any card to view details
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text variant="caption" style={styles.footerText}>
          Built with ❤️ for Expo, React Native developers by BNA
        </Text>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressCard: {
    overflow: "hidden",
  },
  progressContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 20,
    justifyContent: "center",
  },
  rightColumn: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressChartContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  progressTextOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  viewCardsButton: {
    width: "100%",
  },
  // Philippine Government IDs Section Styles
  cardsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 20,
  },
  cardPressable: {
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  carouselHint: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 12,
    opacity: 0.6,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  heroSubtitle: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  heroDescription: {
    textAlign: "center",
    lineHeight: 24,
    maxWidth: width - 80,
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 40,
  },
  gettingStartedSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  gettingStartedCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  terminalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  terminalTitle: {
    fontWeight: "600",
  },
  codeBlock: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    minWidth: "100%",
  },
  bashCommand: {
    fontFamily: "monospace",
    // color: '#00ff00',
    fontSize: 16,
    textAlign: "center",
  },
  installDescription: {
    textAlign: "center",
    opacity: 0.7,
  },
  gettingStartedText: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  gettingStartedButton: {
    alignSelf: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
  },
});
