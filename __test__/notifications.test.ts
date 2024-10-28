import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  startBackgroundFetch,
  requestNotificationPermission,
  areNotificationsEnabled,
} from "../app/services/notifications";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  addNotificationResponseReceivedListener: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock("expo-background-fetch");
jest.mock("expo-task-manager", () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn(),
}));

describe("notifications and background fetch", () => {
  beforeEach(() => {
    AsyncStorage.clear();

    // Mock `getItem` to return "true" for `notificationsEnabled`
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "notificationsEnabled")
        return Promise.resolve(JSON.stringify(true));
      return null;
    });

    // Mock `addNotificationResponseReceivedListener`
    (
      Notifications.addNotificationResponseReceivedListener as jest.Mock
    ).mockImplementation((callback: (event: any) => void) => {
      callback({
        notification: {
          request: {
            content: {
              data: { url: "https://example.com" },
            },
          },
        },
      });
      return { remove: jest.fn() };
    });
  });

  it("requests notification permission", async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    await requestNotificationPermission();
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  });

  it("checks if notifications are enabled", async () => {
    const isEnabled = await areNotificationsEnabled();
    expect(isEnabled).toBe(true); // Expect true as `getItem` is mocked to return "true"
  });

  it("registers background fetch task", async () => {
    await startBackgroundFetch();
    expect(BackgroundFetch.registerTaskAsync).toHaveBeenCalled();
    expect(TaskManager.defineTask).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function)
    );
  });
});
