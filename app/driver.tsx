import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Driver() {
  interface lapData {
    lap_duration: number;
    duration_section_1: number;
    duration_section_2: number;
    duration_section_3: number;
    segments_section_1: number[];
    segments_section_2: number[];
    segments_section_3: number[];
    lap_number: number;
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

  const driver = driverData[0]

  return (
    <View style={styles.container}>
      <View style = {[styles.aboutContainer, {backgroundColor : `#${driver?.team_colour}`}]}>
      <View>
        <Image  style = {styles.driverImage} source={{ uri: driver?.headshot_url }} />
      </View>
      <View>
        <Text>{driver?.full_name}</Text>
        <Text>{driver?.country_code}</Text>
      </View>

      </View>
      <Text>{Math.min(...lapData.map((lap) => lap.lap_duration))}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container : { 
    backgroundColor: "#e8e8e8", 
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  aboutContainer : {
    width: "60%",
    height: 300,
  },
  driverImage :{
    height: 120,
    width: 120,
  },
});
