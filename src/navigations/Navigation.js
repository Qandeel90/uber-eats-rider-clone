import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Order from "../screens/Order/Order";
import OrderDelivery from "../screens/OrderDelivery/OrderDelivery";
const Navigation = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
    </Stack.Navigator>
  );
};

export default Navigation;
