import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import ArticlesScreen from "./screens/ArticlesScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import DeletedScreen from "./screens/DeletedScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ArticleDetailScreen from "./screens/ArticleDetailScreen";
import { RootStackParamList } from "./types/navigation";
import {
  NavigationProvider,
  useNavigationContext,
} from "./context/NavigationContext";

import {
  requestNotificationPermission,
  startBackgroundFetch,
} from "./services/notifications";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function ArticlesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Articles"
        component={ArticlesScreen}
        options={{ title: "Articles" }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: "Article" }}
      />
    </Stack.Navigator>
  );
}

function NotificationListener() {
  const { navigateToArticleDetail } = useNavigationContext();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data.url as string;
        if (url) {
          navigateToArticleDetail(url);
        }
      }
    );

    return () => subscription.remove();
  }, [navigateToArticleDetail]);

  return null;
}

export default function AppNavigator() {
  // Startup function to handle permissions and background fetch initialization
  const startup = async () => {
    await requestNotificationPermission();
    await startBackgroundFetch();
  };

  useEffect(() => {
    startup();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationProvider>
        <NotificationListener />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "ArticlesTab") {
                iconName = "article" as const;
              } else if (route.name === "Favorites") {
                iconName = "favorite" as const;
              } else if (route.name === "Deleted") {
                iconName = "delete" as const;
              } else if (route.name === "Settings") {
                iconName = "settings" as const;
              }

              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            },
            tabBarActiveTintColor: "#4caf50",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name="ArticlesTab"
            component={ArticlesStack}
            options={{ headerShown: false, tabBarLabel: "Articles" }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ tabBarLabel: "Favorites" }}
          />
          <Tab.Screen
            name="Deleted"
            component={DeletedScreen}
            options={{ tabBarLabel: "Deleted" }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ tabBarLabel: "Settings" }}
          />
        </Tab.Navigator>
      </NavigationProvider>
    </GestureHandlerRootView>
  );
}
