import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },
  domain: {
    width: "100%",
    textAlign: "center",
    padding: 5,
    borderRadius: 5,
    fontSize: 20,
    color: "white",
  },
  selected: {
    backgroundColor: "white",
    color: "black",
  },
  goTouchable: {
    padding: 5,
    marginTop: 20,
    borderRadius: 5,
    fontSize: 20,
    color: "cyan",
    width: "100%",
    textAlign: "center",
  },
  outerView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "black",
    position: "relative",
  },
  innerView: {
    display: "flex",
    height: "100%",
    width: "98%",
    marginLeft: "1%",
    position: "absolute",
    top: 20,
    left: 0,
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