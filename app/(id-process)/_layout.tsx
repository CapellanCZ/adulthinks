import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Icon } from "lucide-react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function () {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'ID Detail',
          headerLeft: () => (
            <TouchableOpacity style={{backgroundColor: "transparent"}} onPress={() => router.back()}>
              <ChevronLeft size={24} color="black"  />
            </TouchableOpacity>
          ),
          headerShown: true,
        }}
      />
    </Stack>
  );
}
