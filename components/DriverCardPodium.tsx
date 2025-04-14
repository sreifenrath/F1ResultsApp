import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function DriverCard({
    driver,
  color_key,
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
}) {
  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const router = useRouter();
  function touch(session_key: string, driver_number: string) {
    router.push({
      pathname: "/driver",
      params: { session: `${session_key}`, driver_number: `${driver_number}` },
    });
  }

  return (
    <Pressable onPress = {() => touch(driver?.session_key, driver?.driver_number)} style = {[styles.driverCardPodium, { backgroundColor: color_key }]}>
    <View style = {styles.driverImageView}>
      <Image
          source={{
            uri: driver?.headshot_url,
                }}
            style={{ width: 120, height: 120 }}
      ></Image>
      </View>
      <View style = {{marginLeft: 10}}>
        <Text style={styles.medText}>{driver?.full_name}</Text>
        <Text style = {styles.smallText}> {driver?.team_name}</Text>
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
        borderRadius: 15,
      },
    smallText : {
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
    driverImageView : {
      backgroundColor: "#e8e8e8", 
      borderRadius: 15, 
      padding: 5, 
      borderColor: "black",
      height: 130,
      borderWidth: 3,
    },
});