import { View, Text } from "react-native";
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
  const { blank, session, driver_number } = useLocalSearchParams();
  const [lapData, setLapData] = useState<lapData[]>([]);

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

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <Text>{Math.min(...lapData.map((lap) => lap.lap_duration))}</Text>
    </View>
  );
}
