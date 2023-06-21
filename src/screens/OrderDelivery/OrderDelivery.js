import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import Styles from "./Styles";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";

const OrderDelivery = () => {
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const [deliveryStatus, setDeliveryStatus] = useState("READY_FOR_PICKUP");
  const [isDriverClose, setIsDriverClose] = useState(false);

  const snapPoints = useMemo(() => ["11%", "95%"], []);

  const ORDER_STATUSES = {
    READY_FOR_PICKUP: "READY_FOR_PICKUP",
    ACCEPTED: "ACCEPTED",
    PICKED_UP: "PICKED_UP",
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Location permission not granted");
      return;
    }

    let location = await Location.getCurrentPositionAsync();
    setDriverLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  useEffect(() => {
    let isMounted = true;

    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      if (isMounted) {
        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    };

    getCurrentLocation();

    let foregroundSubscription;
    if (isMounted) {
      foregroundSubscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 100,
        },
        (updatedLocation) => {
          if (isMounted) {
            setDriverLocation({
              latitude: updatedLocation?.coords?.latitude || 0,
              longitude: updatedLocation?.coords?.longitude || 0,
            });
          }
        }
      );
    }

    return () => {
      isMounted = false;
      if (foregroundSubscription) {
        foregroundSubscription.remove();
      }
    };
  }, []);

  const onButtonPressed = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      bottomSheetRef.current?.collapse();
      navigation.goBack();
      console.warn("Delivery Finished");
    }
  };

  const renderButtonTitle = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return "Accept Order";
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      return "Pick-Up Order";
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      return "Complete Delivery";
    }
  };

  const isButtonDisabled = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose) {
      return false;
    }
    return true;
  };

  if (!driverLocation) {
    return <ActivityIndicator size="large" />;
  }

  const restaurantLocation = {
    latitude: order.Restaurant.lat,
    longitude: order.Restaurant.lng,
  };

  const deliveryLocation = {
    latitude: order.User.lat,
    longitude: order.User.lng,
  };

  return (
    <View style={Styles.container}>
      {driverLocation && (
        <MapView
          ref={mapRef}
          style={{ width, height }}
          showsUserLocation
          followsUserLocation
          initialRegion={{
            latitude: driverLocation.latitude,
            longitude: driverLocation.longitude,
            latitudeDelta: 0.07,
            longitudeDelta: 0.07,
          }}
        >
          <MapViewDirections
            origin={driverLocation}
            destination={
              deliveryStatus === ORDER_STATUSES.ACCEPTED
                ? restaurantLocation
                : deliveryLocation
            }
            strokeWidth={7}
            waypoints={
              deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP
                ? [restaurantLocation]
                : []
            }
            strokeColor="green"
            apikey="AIzaSyAR4C_adXvPbwBKpy1nyD0tO5w831rZ3KY"
            onReady={(result) => {
              setIsDriverClose(result.distance <= 0.1);
              setTotalMinutes(result.duration);
              setTotalKm(result.distance);
            }}
          />
          <Marker
            coordinate={restaurantLocation}
            title={order.Restaurant.name}
            description={order.Restaurant.address}
          >
            <View
              style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
            >
              <Entypo name="shop" size={30} color="white" />
            </View>
          </Marker>

          <Marker
            coordinate={deliveryLocation}
            title={order.User.name}
            description={order.User.address}
          >
            <View
              style={{ backgroundColor: "green", padding: 5, borderRadius: 20 }}
            >
              <MaterialIcons name="restaurant" size={30} color="white" />
            </View>
          </Marker>
        </MapView>
      )}
      {deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP && (
        <Ionicons
          onPress={() => navigation.goBack()}
          name="arrow-back-circle"
          size={45}
          color="black"
          style={{ top: 40, left: 15, position: "absolute" }}
        />
      )}
      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={Styles.deliveryContent}>
          <Text style={Styles.deliveryContentTxt}>
            {totalMinutes.toFixed(0)} min
          </Text>
          <MaterialIcons name="delivery-dining" size={30} color="green" />
          <Text style={Styles.deliveryContentTxt}>{totalKm.toFixed(2)} km</Text>
        </View>
        <View style={Styles.restaurantContainer}>
          <Text
            style={{ fontSize: 27, fontWeight: "500", paddingVertical: 10 }}
          >
            {order?.Restaurant.name}
          </Text>

          <View style={Styles.restaurantInnerContainer}>
            <MaterialCommunityIcons
              name="store-marker"
              style={Styles.markericons}
            />
            <Text style={Styles.address}>{order?.Restaurant.address}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <MaterialCommunityIcons
              name="map-marker-account"
              style={Styles.markericons}
            />
            <Text s style={Styles.address}>
              {order?.User.address}
            </Text>
          </View>
        </View>
        <View style={Styles.itemContainer}>
          <Text style={Styles.itemTxt}>Onion Rings x1</Text>
          <Text style={Styles.itemTxt}>Big Mac x2</Text>
          <Text style={Styles.itemTxt}>Big Tasty x1</Text>
        </View>
        <View style={Styles.bottomContainer}>
          <TouchableOpacity
            style={[
              Styles.bottomBtn,
              { backgroundColor: isButtonDisabled() ? "grey" : "green" },
            ]}
            onPress={onButtonPressed}
            disabled={isButtonDisabled()}
          >
            <Text style={Styles.BottomBtnTxt}>{renderButtonTitle()}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

export default OrderDelivery;
