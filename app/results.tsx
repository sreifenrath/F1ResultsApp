import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import DriverCardPodium from "../components/DriverCardPodium";

export default function Results() {
  interface positionData {
    position: number;
    driver_number: string;
    date: Date;
    session_key: string;
  }

  interface driver {
    driver_number: string;
    full_name: string;
    team_name: string;
    headshot_url: string;
    country_code: string;
    session_key: string;
  }

  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const { blank, query, race_name } = useLocalSearchParams();
  const key = Number(query);
  const race_title = String(race_name);
  const [positionData, setPositionData] = useState<positionData[]>([]);
  const [driver, setDriver] = useState<driver[]>([]);
  const [showRaceResults, setShowRaceResults] = useState(true);
  const [barVisible, setBarVisible] = useState(false);

  const getSessions = (positionData: positionData[]): string[] => {
    const sessionNo = new Set(
      positionData.map((item) => item.session_key.toString())
    );
    return Array.from(sessionNo);
  };

  const sessions = getSessions(positionData);

  const arrangeResults = (
    positionData: positionData[],
    index: number
  ): string[] => {
    const sessionKey = sessions[sessions.length - index];
    const positionNo = new Set(positionData.map((item) => item.position));
    const results = [];

    for (let i = 0; i < positionNo.size; i++) {
      results[i] = positionData
        .filter(
          (item) =>
            item.position === i + 1 &&
            item.session_key.toString().trim() === sessionKey.trim()
        )
        .at(-1)?.driver_number;
    }
    return results.map(String);
  };

  const fetchDriverData = async () => {
    try {
      if (!key) return;

      const res = await fetch(
        `https://api.openf1.org/v1/drivers?meeting_key=${key}`
      );
      const allDrivers = await res.json();

      // Deduplicate by driver_number (keep the first entry or latest if needed)
      const uniqueDriversMap = new Map();
      for (const driver of allDrivers) {
        if (!uniqueDriversMap.has(driver.driver_number)) {
          uniqueDriversMap.set(driver.driver_number, driver);
        }
      }

      const uniqueDrivers = Array.from(uniqueDriversMap.values());

      setDriver(uniqueDrivers);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDriverData();
    }, 700);
    return () => clearTimeout(timeout);
  }, [positionData]);

  const renderDriver = ({ item, index }: { item: string; index: number }) => {
    const curr_driver = driver.find(
      (driverItem) => driverItem.driver_number.toString() === item
    );
    if (curr_driver && showRaceResults === true) {
      curr_driver.session_key = sessions[sessions.length - 1];
    }
    if (curr_driver && showRaceResults === false) {
      curr_driver.session_key = sessions[sessions.length - 2];
    }
    if (index === 0) {
      return (
        <DriverCardPodium
          driver={
            curr_driver || {
              driver_number: "",
              full_name: "",
              team_name: "",
              headshot_url: "",
              country_code: "",
              session_key: "",
            }
          }
          color_key={"#e8be3a"}
        ></DriverCardPodium>
      );
    } else if (index === 1) {
      return (
        <DriverCardPodium
          driver={
            curr_driver || {
              driver_number: "",
              full_name: "",
              team_name: "",
              headshot_url: "",
              country_code: "",
              session_key: "",
            }
          }
          color_key={"silver"}
        ></DriverCardPodium>
      );
    } else if (index === 2) {
      return (
        <DriverCardPodium
          driver={
            curr_driver || {
              driver_number: "",
              full_name: "",
              team_name: "",
              headshot_url: "",
              country_code: "",
              session_key: "",
            }
          }
          color_key={"#977547"}
        ></DriverCardPodium>
      );
    } else {
      return (
        <View style={styles.driverCard}>
          <Text>{index + 1}</Text>
          <Text style={styles.medText}>{curr_driver?.full_name}</Text>
        </View>
      );
    }
  };

  useEffect(() => {
    fetch(`https://api.openf1.org/v1/position?meeting_key=${key}`)
      .then((response) => response.json())
      .then((positionData) => {
        setPositionData(positionData);
      });
  }, [key]);

  const raceResults = arrangeResults(positionData, 1);
  const qualiResults = arrangeResults(positionData, 2);

  return (
    <View style={styles.viewContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{race_name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            setShowRaceResults(false);
            setBarVisible(true);
          }}
          style={[
            { backgroundColor: showRaceResults ? "#e8e8e8" : "white" },
            styles.qualiRaceButton,
          ]}
        >
          <Text style={styles.largeText}>QUALIFYING</Text>
          {barVisible && <View style={styles.redBar}></View>}
        </Pressable>
        <Pressable
          onPress={() => {
            setShowRaceResults(true);
            setBarVisible(false);
          }}
          style={[
            { backgroundColor: showRaceResults ? "white" : "#e8e8e8" },
            styles.qualiRaceButton,
          ]}
        >
          <Text style={styles.largeText}>RACE</Text>
          {!barVisible && <View style={styles.redBar}></View>}
        </Pressable>
      </View>
      <FlatList
        data={showRaceResults ? raceResults : qualiResults}
        renderItem={renderDriver}
        keyExtractor={(item) => item.toString()}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e8e8e8",
  },
  titleContainer: {
    backgroundColor: "red",
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  medText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  largeText: {
    fontSize: 27,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  titleText: {
    fontSize: 55,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 3,
    color: "white",
  },
  driverCardPodium: {
    margin: 10,
    padding: 10,
    width: 700,
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
  },
  driverCard: {
    margin: 10,
    padding: 10,
    width: 700,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    height: 100,
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  qualiRaceButton: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  redBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: "red",
  },
});
