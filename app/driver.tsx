import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Audio } from "expo-av";

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

  interface radioData {
    date: Date;
    recording_url: string;
  }
  const { blank, session, driver_number } = useLocalSearchParams();
  const [lapData, setLapData] = useState<lapData[]>([]);
  const [driverData, setDriverData] = useState<driverData[]>([]);
  const [radioData, setRadioData] = useState<radioData[]>([]);

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

  useEffect(() => {
    fetch(
      `https://api.openf1.org/v1/team_radio?session_key=${session}&driver_number=${driver_number}`
    )
      .then((response) => response.json())
      .then((audio) => {
        setRadioData(audio);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [session, driver_number]);

  const playAudio = async (url: string) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );
  };

  const renderRadioItem = ({
    item,
    index,
  }: {
    item: radioData;
    index: number;
  }) => {
    return (
      <View style={styles.radioContainer}>
        <Pressable
          onPress={() => playAudio(item.recording_url)}
          style={styles.playRadio}
        >
          <Image
            source={require("../assets/images/playbutton.png")}
            style={{ height: 20, width: 20 }}
          />
        </Pressable>
        <View style={styles.radioTextContainer}>
          <Text style={styles.medText}>Radio Message {index + 1}</Text>
        </View>
      </View>
    );
  };

  const driver = driverData[0];
  const fastestLap =
    lapData.length > 0
      ? lapData.reduce((fastest, current) =>
          current.lap_duration < fastest.lap_duration ? current : fastest
        )
      : null; // or undefined, or a fallback object

  return (
    <View style={styles.container}>
      <View style={styles.aboutContainer}>
        <Image
          style={[
            styles.driverImage,
            { backgroundColor: `#${driver?.team_colour}` },
          ]}
          source={{ uri: driver?.headshot_url }}
        />
        <View style={styles.driverContainer}>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Name:</Text>
          <Text style={styles.medText}>{driver?.full_name}</Text>
          <Text>{"\n"}</Text>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Country:</Text>
          <Text style={styles.medText}>{driver?.country_code}</Text>
          <Text>{"\n"}</Text>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>Team:</Text>
          <Text style={styles.medText}>{driver?.team_name}</Text>
          <Text>{"\n"}</Text>
        </View>
        <View>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>
            Lap Time:
          </Text>
          <Text style={styles.medText}>{fastestLap?.lap_duration}</Text>
          <Text>{"\n"}</Text>
          <Text style={[styles.medText, { fontWeight: "bold" }]}>
            Top Speed:
          </Text>
          <Text style={styles.medText}>{fastestLap?.st_speed}kph</Text>
          <Text>{"\n"}</Text>
        </View>
      </View>
      <View style={styles.sectorContainer}>
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
      <FlatList data={radioData} renderItem={renderRadioItem}></FlatList>
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
    justifyContent: "flex-start",
    padding: 30,
    marginTop: 50,
    marginBottom: 20,
    backgroundColor: "white",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
  },
  driverImage: {
    height: 120,
    width: 120,
    marginRight: 20,
    borderColor: "black",
    borderWidth: 3,
  },
  driverContainer: {},
  sectorContainer: {
    width: "60%",
    height: 100,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingLeft: 40,
    paddingRight: 40,
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
  radioContainer: {
    flexDirection: "row",
    padding: 2,
  },
  playRadio: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  radioTextContainer: {
    height: 50,
    width: 600,
    backgroundColor: "white",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
    padding: 10,
  },
});
