import { StyleSheet } from "react-native";
import GlobalColor from "../../common/GlobalColor";
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  deliveryContent: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 10,

    gap: 10,
  },
  deliveryContentTxt: {
    fontSize: 25,
  },
  restaurantContainer: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: GlobalColor.Grey,
  },
  restaurantInnerContainer: {
    flexDirection: "row",
  },
  markericons: {
    color: GlobalColor.Grey,
    fontSize: 32,
    paddingRight: 10,
  },
  address: {
    fontSize: 20,
    color: GlobalColor.Grey,
  },
  itemContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  itemTxt: {
    fontSize: 16,
    color: GlobalColor.Grey,
  },
  bottomContainer: { flex: 0.95, justifyContent: "flex-end" },
  bottomBtn: {
    backgroundColor: "green",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    paddingVertical: 10,
  },
  BottomBtnTxt: { color: "white", fontSize: 23, fontWeight: "400" },
});
