import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { requestNotificationPermission } from "../services/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PlatformPreference = "android" | "ios" | "mobile";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [platformPreference, setPlatformPreference] =
    useState<PlatformPreference>("mobile");

  useEffect(() => {
    (async () => {
      const savedNotificationsEnabled = await AsyncStorage.getItem(
        "notificationsEnabled"
      );
      const savedPreference = (await AsyncStorage.getItem(
        "platformPreference"
      )) as PlatformPreference;

      if (savedNotificationsEnabled !== null) {
        setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
      }
      if (savedPreference) {
        setPlatformPreference(savedPreference);
      }
    })();
  }, []);

  const toggleNotifications = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    await AsyncStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(newStatus)
    );

    // Request notification permissions if enabling notifications
    if (newStatus) {
      await requestNotificationPermission();
    }
  };

  const handlePreferenceChange = async (value: PlatformPreference) => {
    setPlatformPreference(value);
    await AsyncStorage.setItem("platformPreference", value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.option}>
        <Text style={styles.optionText}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor={notificationsEnabled ? "#4caf50" : "#f44336"}
        />
      </View>
      <View style={[styles.option, styles.optionPreference]}>
        <Text style={styles.optionText}>Notification Preference</Text>
        <Picker
          selectedValue={platformPreference}
          onValueChange={handlePreferenceChange}
          style={styles.picker}
        >
          <Picker.Item label="Android" value="android" />
          <Picker.Item label="iOS" value="ios" />
          <Picker.Item label="All Mobile" value="mobile" />
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionPreference: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 30,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
  picker: {
    width: "100%",
    backgroundColor: "#eee",
    borderRadius: 4,
    marginTop: 20,
  },
});
