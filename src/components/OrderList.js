import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import GlobalStyle from "../common/GlobalStyle";
import { TouchableOpacity } from "react-native-gesture-handler";
import GlobalColor from "../common/GlobalColor";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const OrderList = ({ order }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          style={styles.img}
          source={{ uri: order.Restaurant.image }}
        ></Image>
        <View style={styles.orderTexts}>
          <View style={styles.upText}>
            <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
            <Text style={styles.restaurantAddress}>
              {order.Restaurant.address}
            </Text>
          </View>
          <View style={styles.bottomText}>
            <Text style={styles.h3}>Delivery Details: </Text>
            <Text style={styles.userName}>{order.User.name}</Text>
            <Text style={styles.userAddress}>{order.User.address}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("OrderDelivery", { order: order })}
          style={styles.btn}
        >
          <Entypo style={styles.icon} name="check" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderList;
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 10,
    marginVertical: 7,
    borderRadius: 15,
  },
  innerContainer: {
    flexDirection: "row",
  },
  img: {
    width: 80,
    height: "auto",
    borderRadius: 10,
    margin: 5,
    flex: 1,
  },
  orderTexts: { flex: 3, padding: 5 },
  upText: { paddingBottom: 5 },
  restaurantName: { fontSize: 18, fontWeight: "bold" },
  restaurantAddress: { color: GlobalColor.Grey },
  bottomText: {},
  h3: { fontSize: 15, fontWeight: "500" },
  userName: {},
  userAddress: { color: GlobalColor.Grey },
  btn: {
    flex: 1,
    backgroundColor: GlobalColor.Black,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  icon: {
    padding: 10,
    color: "white",
    fontSize: 26,
  },
});
