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

  const { blank, query } = useLocalSearchParams();
  const key = Number(query);
  const [positionData, setPositionData] = useState<positionData[]>([]);
  const [driver, setDriver] = useState<driver[]>([]);
  const [showRaceResults, setShowRaceResults] = useState(true);

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
    if (index === 0) {
      return (
        <View style={[styles.driverCardPodium, styles.gold]}>
          <Image
            source={{
              uri: curr_driver?.headshot_url,
            }}
            style={{ width: 120, height: 120 }}
          ></Image>

          <Text style={styles.title}>{curr_driver?.full_name}</Text>
        </View>
      );
    } else if (index === 1) {
      return (
        <View style={[styles.driverCardPodium, styles.silver]}>
          <Image
            source={{
              uri: curr_driver?.headshot_url,
            }}
            style={{ width: 120, height: 120 }}
          ></Image>

          <Text style={styles.title}>{curr_driver?.full_name}</Text>
        </View>
      );
    } else if (index === 2) {
      return (
        <View style={[styles.driverCardPodium, styles.bronze]}>
          <Image
            source={{
              uri: curr_driver?.headshot_url,
            }}
            style={{ width: 120, height: 120 }}
          ></Image>

          <Text style={styles.title}>{curr_driver?.full_name}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.driverCard}>
          <Text style={styles.title}>{curr_driver?.full_name}</Text>
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
    <ImageBackground
      source={require("../assets/images/f1background.jpg")}
      style={styles.imageBackground}
    >
      <View style={styles.viewContainer}>
        <View>
          <Pressable onPress={() => setShowRaceResults(true)}>
            <Text style={styles.title}>RACE</Text>
          </Pressable>
          <Pressable onPress={() => setShowRaceResults(false)}>
            <Text style={styles.title}>QUALIFYING</Text>
          </Pressable>
        </View>
        <FlatList
          data={showRaceResults ? raceResults : qualiResults}
          renderItem={renderDriver}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  viewContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  gold: {
    backgroundColor: "#e8be3a",
  },
  silver: {
    backgroundColor: "silver",
  },
  bronze: {
    backgroundColor: "#977547",
  },
  driverCardPodium: {
    margin: 10,
    padding: 10,
    width: 700,
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  driverCard: {
    backgroundColor: "grey",
    margin: 10,
    padding: 10,
    width: 500,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
