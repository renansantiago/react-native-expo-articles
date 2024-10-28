import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { BackgroundFetchResult } from "expo-background-fetch";
import { fetchArticles } from "../utils/fetchArticles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article } from "../types";

const FETCH_TASK = "background-fetch";

TaskManager.defineTask(FETCH_TASK, async () => {
  try {
    const notificationsEnabled = await areNotificationsEnabled();
    if (!notificationsEnabled) {
      return BackgroundFetchResult.NoData;
    }

    const platformPreference = await getPlatformPreference();
    const articles: Article[] = await fetchArticles(platformPreference);

    if (articles.length) {
      const latestArticle = articles[0];
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `New articles for ${platformPreference}!`,
          body: "Check out the latest articles.",
          data: { url: latestArticle.story_url },
        },
        trigger: null,
      });
      return BackgroundFetchResult.NewData;
    } else {
      return BackgroundFetchResult.NoData;
    }
  } catch (error) {
    console.error("Background fetch failed:", error);
    return BackgroundFetchResult.Failed;
  }
});

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Please allow notifications to receive article updates.");
  }
};

export const getPlatformPreference = async (): Promise<string> => {
  const preference = await AsyncStorage.getItem("platformPreference");
  return preference || "mobile";
};

export const areNotificationsEnabled = async (): Promise<boolean> => {
  const enabled = await AsyncStorage.getItem("notificationsEnabled");
  return enabled ? JSON.parse(enabled) : false;
};

export const startBackgroundFetch = async () => {
  await BackgroundFetch.registerTaskAsync(FETCH_TASK, {
    // TODO: Set to 60 seconds for testing; change to 3600 (1 hour) in production to save resources
    minimumInterval: 10,
  });
};
