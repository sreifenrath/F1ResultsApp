import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function DriverCard({
  driver,
  color_key,
  session_name,
}: {
  driver: {
    driver_number: string;
    full_name: string;
    team_name: string;
    headshot_url: string;
    country_code: string;
    session_key: string;
  };
  color_key: string;
  session_name: string;
}) {
  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const router = useRouter();
  function touch(session_key: string, driver_number: string, session_name: string) {
    router.push({
      pathname: "/driver",
      params: { session: `${session_key}`, driver_number: `${driver_number}`, session_name: `${session_name}` },
    });
  }

  return (
    <Pressable
      onPress={() => touch(driver?.session_key, driver?.driver_number, session_name)}
      style={[styles.driverCardPodium, { backgroundColor: color_key }]}
    >
      <View style={styles.driverImageView}>
        <Image
          source={{
            uri: driver?.headshot_url,
          }}
          style={{ width: 120, height: 120 }}
        ></Image>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.medText}>{driver?.full_name}</Text>
        <Text style={styles.smallText}> {driver?.team_name}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  driverCardPodium: {
    margin: 10,
    padding: 10,
    width: 700,
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
  },
  smallText: {
    fontSize: 15,
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  medText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
  },
  driverImageView: {
    backgroundColor: "#e8e8e8",
    padding: 5,
    borderColor: "black",
    height: 131,
    borderWidth: 3,
  },
});
