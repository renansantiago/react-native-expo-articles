import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { ArticleDetailScreenRouteProp } from "../types/navigation";

interface ArticleDetailScreenProps {
  route: ArticleDetailScreenRouteProp;
}

export default function ArticleDetailScreen({
  route,
}: ArticleDetailScreenProps) {
  const { url } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
