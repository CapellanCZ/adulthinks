import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";

// This is the initial screen for the (auth) group
export default function AuthIndex() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/3d-hand.jpg")}
            width={"100%"}
            height={"90%"}
            variant="default"
            contentFit="contain"
            style={{ backgroundColor: "white" }}
          />
        </View>

        <View>
          <View style={{ padding: 20 }}>
            <View>
              <View>
                <Text
                  style={{ textAlign: "center", fontSize: 32 }}
                  variant="heading"
                >
                  Learn how to get those essential IDs
                </Text>
                <Text style={{ textAlign: "center", marginTop: 15 }}>
                  Guiding you through the process of getting essential IDs
                </Text>
              </View>
            </View>

            <View style={{ gap: 10, marginTop: 15 }}>
              <Button onPress={() => router.push("/(auth)/signup")}>
                Get Started
              </Button>
              <Button
                variant="outline"
                onPress={() => router.push("/(auth)/login")}
              >
                Sign In
              </Button>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 50,
  },
});
