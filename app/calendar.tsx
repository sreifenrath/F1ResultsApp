import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import DropDownButton from "../components/DropDownButton";

export default function Calendar() {
  interface RaceData {
    meeting_name: string;
    country_name: string;
    location: string;
    meeting_key: string;
    date_start: string;
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

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderRace = ({ item, index }: { item: RaceData; index: number }) => {
    return (
      <Pressable
        style={styles.raceContainer}
        onPress={() => touch(item.meeting_key, item.meeting_name)}
        onHoverIn={() => setHoveredIndex(index)}
        onHoverOut={() => setHoveredIndex(null)}
      >
        <Text
          style={[
            styles.medText,
            hoveredIndex === index
              ? { color: "red", fontSize: 21 }
              : { color: "black" },
          ]}
        >
          {item.meeting_name}
        </Text>
        <Text style={styles.smallText}>
          {item.location}, {item.country_name}
        </Text>
      </Pressable>
    );
  };

  const [raceData, setRaceData] = useState<RaceData[]>([]);
  const [year, setYear] = useState<number>(2023);

  const handlePress = (id: number) => {
    setYear(id);
  };

  useEffect(() => {
    fetch(`https://api.openf1.org/v1/meetings`)
      .then((response) => response.json())
      .then((raceData) => {
        const filteredData = raceData
          .filter(
            (race: { meeting_name: string }) =>
              !race.meeting_name.toLowerCase().includes("testing")
          )
          .map((race: { date_start: string | number | Date }) => ({
            ...race,
            date_start: new Date(race.date_start).getUTCFullYear().toString(),
          }));

        setRaceData(filteredData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [year]);

  const seasons = Array.from(
    new Set(raceData.map((race) => new Date(race.date_start).getUTCFullYear()))
  );

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
            data={raceData.filter(
              (race) => race.date_start === year.toString()
            )}
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
    backgroundColor: "#e8e8e8",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    flex: 1,
  },
  yearContainer: {
    alignItems: "center",
    padding: 10,
  },
  flatlistContainer: {
    height: "80%",
    width: "50%",
    margin: 25,
    padding: 10,
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
  smallText: {
    fontSize: 11,
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  raceContainer: {
    padding: 10,
    margin: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    backgroundColor: "white",
  },
});
