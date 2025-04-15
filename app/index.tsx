import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import DropDownButton from "../components/DropDownButton";

export default function Index() {
  interface RaceData {
    meeting_name: string;
    country_name: string;
    location: string;
    meeting_key: string;
  }

  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const router = useRouter();
  function touch(key: string, race_name: string) {
    router.push({
      pathname: "/results",
      params: { query: `${key}`, race_name: `${race_name}` },
    });
  }

  const renderRace = ({ item, index }: { item: RaceData; index: number }) => {
    return (
      <Pressable
        style={styles.raceContainer}
        onPress={() => touch(item.meeting_key, item.meeting_name)}
      >
        <Text style={styles.title}>{item.meeting_name}</Text>
      </Pressable>
    );
  };

  const [raceData, setRaceData] = useState<RaceData[]>([]);
  const year = 2024;

  useEffect(() => {
    fetch(`https://api.openf1.org/v1/meetings?year=${year}`)
      .then((response) => response.json())
      .then((raceData) => {
        setRaceData(raceData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [year]);

  return (
    <View style={styles.container}>
      <DropDownButton></DropDownButton>
      <FlatList
        data={raceData}
        renderItem={renderRace}
        numColumns={2}
        keyExtractor={(item) => item.meeting_key}
        showsVerticalScrollIndicator={false}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  raceContainer: {
    backgroundColor: "grey",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 600,
    height: 75,
  },
});
