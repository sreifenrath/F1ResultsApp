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

  const seasons = [2023, 2024, 2025];

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
        <Text style={styles.medText}>{item.meeting_name}</Text>
      </Pressable>
    );
  };

  const [raceData, setRaceData] = useState<RaceData[]>([]);
  const [year, setYear] = useState<number>(seasons[0]);

  const handlePress = (id: number) => {
    setYear(id);
  };

  useEffect(() => {
    fetch(`https://api.openf1.org/v1/meetings?year=${year}`)
      .then((response) => response.json())
      .then((raceData) => {
        setRaceData(raceData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [year]);

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{year} Calendar Results</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.yearContainer}>
          <DropDownButton
            handlePress={handlePress}
            seasons={seasons}
            currentYear={year}
          />
        </View>
        <View style={styles.flatlistContainer}>
          <FlatList
            style={{ flex: 1 }}
            data={raceData}
            renderItem={renderRace}
            keyExtractor={(item) => item.meeting_key}
          ></FlatList>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  yearContainer: {
    alignItems: "center",
    padding: 10,
  },
  flatlistContainer: {
    height: "70%",
    width: 500,
    margin: 25,
  },
  titleContainer: {
    backgroundColor: "red",
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 55,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 3,
    color: "white",
  },
  medText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  raceContainer: {
    padding: 10,
    margin: 2,
    borderRadius: 5,
    borderBottomWidth: 3,
    borderLeftWidth: 2,
    borderColor: "grey",
  },
});
