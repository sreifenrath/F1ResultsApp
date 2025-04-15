import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";

export default function DropDownButton() {
  const seasons = [2023, 2024, 2025];
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);

  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const renderItem = ({ item }: { item: number }) => {
    return (
      <Pressable
        onPress={() => setSelectedSeason(item)}
        style={styles.seasonContainer}
      >
        <Text style={styles.medText}>{item}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={seasons}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  seasonContainer: {
    padding: 15,
    margin: 5,
  },
  medText: {
    fontSize: 45,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
});
