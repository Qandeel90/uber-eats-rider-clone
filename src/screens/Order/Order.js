import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, FlatList, useWindowDimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import Styles from "./Styles";
import orders from "../../../assets/orders.json";
import OrderList from "../../components/OrderList";
import { Entypo } from "@expo/vector-icons";
const Order = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["13%", "95%"], []);
  const { height, width } = useWindowDimensions();
  /* const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []); */

  return (
    <View style={Styles.container}>
      <MapView
        style={{
          height,
          width,
        }}
        showsUserLocation
        followsUserLocation
      >
        {orders.map((order) => (
          <Marker
            key={order.id}
            title={order.Restaurant.name}
            description={order.Restaurant.address}
            coordinate={{
              latitude: order.Restaurant.lat,
              longitude: order.Restaurant.lng,
            }}
          >
            <View
              style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
            >
              <Entypo name="shop" size={24} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              letterSpacing: 0.5,
              paddingBottom: 5,
            }}
          >
            You're Online
          </Text>
          <Text style={{ letterSpacing: 0.5, color: "grey" }}>
            Available Orders: {orders.length}
          </Text>
        </View>
        <FlatList
          data={orders}
          renderItem={({ item }) => <OrderList order={item} />}
        />
      </BottomSheet>
    </View>
  );
};

export default Order;
