import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  wrapper: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  settingButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
  },
  indicatorWrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
  },
  infiniteIndicatorWrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    left: 0,
    zIndex: 2,
  },
  fact: {
    justifyContent: "center",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  text: {
    color: "white",
    fontSize: 25,
    lineHeight: 32,
    position: "absolute",
    fontFamily: "serif",
    top: 30,
    left: 20,
    padding: 20,
    zIndex: 2,
  },
  background: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlay: {
    position: "absolute",
    zIndex: 1,
    opacity: 0.5,
    backgroundColor: "black",
    height: "100%",
    width: "100%",
  }
});

export default styles;