import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function () {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen
        name="list"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
