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

interface HandlePressProps {
  handlePress: (id: number) => void;
  seasons: number[];
}

export default function DropDownButton({
  handlePress,
  seasons,
}: HandlePressProps) {
  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const renderItem = ({ item }: { item: number }) => {
    return (
      <Pressable
        onPress={() => handlePress(item)}
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
    margin: 5,
  },
  medText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
});
