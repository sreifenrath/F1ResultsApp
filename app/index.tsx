import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  function touch() {
    router.push({
      pathname: "/calendar",
    });
  }

  const [fontsLoaded] = useFonts({
    FormulaFont: require("../assets/fonts/Formula1-Regular_web_0.ttf"),
  });

  const images = [
    require("../assets/images/f1-1.jpg"),
    require("../assets/images/f1-2.jpg"),
    require("../assets/images/f1-3.png"),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Formula 1 Results</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.aboutContainer}>
          <Text style={styles.largeText}>What Is Formula 1?</Text>
          <Text style={styles.medText}>
            Formula One (F1) is the highest class of international racing for
            open-wheel single-seater formula racing cars sanctioned by the FIA
            (Fédération Internationale de l'Automobile). The FIA Formula One
            World Championship has been one of the world's premier forms of
            motorsport since its inaugural running in 1950 and is often
            considered to be the pinnacle of motorsport.
          </Text>
          <Text style={styles.medText}>
            The word formula in the name refers to the set of rules all
            participant cars must follow. A Formula One season consists of a
            series of races, known as Grands Prix. Grands Prix take place in
            multiple countries and continents on either purpose-built circuits
            or closed roads.
          </Text>
          <Pressable onPress={() => touch()} style={styles.button}>
            <Text style={[styles.medText, { fontWeight: "bold" }]}>
              Go to Results
            </Text>
          </Pressable>
        </View>
        <View style={styles.imageContainer}>
          <Pressable
            onPress={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length
              )
            }
          >
            <Text style={styles.arrow}>←</Text>
          </Pressable>
          <Image source={images[currentIndex]} style={styles.image}></Image>
          <Pressable
            onPress={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
          >
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e8e8e8",
    alignItems: "center",
  },
  titleContainer: {
    backgroundColor: "red",
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  aboutContainer: {
    width: "60%",
    alignItems: "center",
    paddingBottom: 30,
  },
  titleText: {
    fontSize: 55,
    fontWeight: "bold",
    fontFamily: "FormulaFont",
    letterSpacing: 3,
    color: "white",
  },
  largeText: {
    fontSize: 35,
    fontFamily: "FormulaFont",
    fontWeight: "bold",
  },
  medText: {
    fontSize: 25,
    fontFamily: "FormulaFont",
    letterSpacing: 1,
    margin: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    width: 250,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 2,
    borderBottomWidth: 3,
  },
  image: {
    height: "100%",
    width: "100%",
    minHeight: 200,
    minWidth: 200,
    maxHeight: 700,
    maxWidth: 1400,
  },
  imageContainer: {
    flexDirection: "row",
    width: "50%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    fontFamily: "FormulaFont",
    letterSpacing: 1,
    padding: 5,
    opacity: 0.5,
  },
});
