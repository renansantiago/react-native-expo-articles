import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function ArticleDetail() {
  const { url } = useLocalSearchParams();

  if (!url) {
    return (
      <View>
        <Text>URL not provided</Text>
      </View>
    );
  }

  return <WebView source={{ uri: url as string }} />;
}
