import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Driver() {
    const {blank, session, driver_number } = useLocalSearchParams();
  return (
    <View>
      <Text>{session}, {driver_number}</Text>
    </View>
  );
}