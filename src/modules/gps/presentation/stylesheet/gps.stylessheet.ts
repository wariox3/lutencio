import { StyleSheet } from "react-native";

export const gpsStyles = StyleSheet.create({
    mapContainer: {
      flex: 0.9,
      width: "100%",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });