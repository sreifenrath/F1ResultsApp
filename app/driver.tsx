import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";

export default function Driver() {
  interface lapData {
    lap_duration: number;
    duration_sector_1: number;
    duration_sector_2: number;
    duration_sector_3: number;
    segments_sector_1: number[];
    segments_sector_2: number[];
    segments_sector_3: number[];
    lap_number: number;
    st_speed: number;
  }

  interface driverData {
    country_code: string;
    full_name: string;
    headshot_url: string;
    name_acronym: string;
    team_colour: string;
    team_name: string;
  }
  const { blank, session, driver_number } = useLocalSearchParams();
  const [lapData, setLapData] = useState<lapData[]>([]);
  const [driverData, setDriverData] = useState<driverData[]>([]);

  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  useEffect(() => {
    fetch(
      `https://api.openf1.org/v1/laps?session_key=${session}&driver_number=${driver_number}`
    )
      .then((response) => response.json())
      .then((laps) => {
        const validLaps = laps.filter(
          (lap: lapData) => lap.lap_duration !== null
        );
        setLapData(validLaps);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [session, driver_number]);

  useEffect(() => {
    fetch(
      `https://api.openf1.org/v1/drivers?session_key=${session}&driver_number=${driver_number}`
    )
      .then((response) => response.json())
      .then((driver) => {
        setDriverData(driver);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [session, driver_number]);

  const driver = driverData[0];
  const fastestLap =
    lapData.length > 0
      ? lapData.reduce((fastest, current) =>
          current.lap_duration < fastest.lap_duration ? current : fastest
        )
      : null; // or undefined, or a fallback object

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.aboutContainer,
          { borderColor: `#${driver?.team_colour}` },
        ]}
      >
        <Image
          style={styles.driverImage}
          source={{ uri: driver?.headshot_url }}
        />
        <View style={styles.driverContainer}>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Name:</Text>
          <Text style={styles.medText}>{driver?.full_name}</Text>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Country:</Text>
          <Text style={styles.medText}>{driver?.country_code}</Text>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Team:</Text>
          <Text style={styles.medText}>{driver?.team_name}</Text>
        </View>
        <View>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>
            Lap Time:
          </Text>
          <Text style={styles.medText}>{fastestLap?.lap_duration}</Text>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>
            Top Speed:
          </Text>
          <Text style={styles.medText}>{fastestLap?.st_speed}kph</Text>
        </View>
      </View>
      <View
        style={[
          styles.sectorContainer,
          { borderColor: `#${driver?.team_colour}` },
        ]}
      >
        <View style={styles.sectorTimeContainer}>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Sector 1</Text>
          <Text style={styles.medText}>{fastestLap?.duration_sector_1}</Text>
        </View>
        <View style={styles.sectorTimeContainer}>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Sector 2</Text>
          <Text style={styles.medText}>{fastestLap?.duration_sector_2}</Text>
        </View>
        <View style={styles.sectorTimeContainer}>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Sector 3</Text>
          <Text style={styles.medText}>{fastestLap?.duration_sector_3}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e8e8e8",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  aboutContainer: {
    width: "60%",
    height: 230,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
    marginBottom: 20,
    backgroundColor: "white",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
  },
  driverImage: {
    height: 120,
    width: 120,
  },
  driverContainer: {
    padding: 20,
  },
  sectorContainer: {
    width: "60%",
    height: 100,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 60,
    paddingRight: 60,
    borderLeftWidth: 2,
    borderBottomWidth: 3,
  },
  sectorTimeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  medText: {
    fontSize: 20,
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
});
