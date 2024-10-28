import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Article } from "../types";

interface ArticleItemProps {
  article: Article;
  onFavorite?: (article: Article) => void;
  isFavorite?: boolean;
  onDelete?: (article: Article) => void;
  onUndo?: (article: Article) => void;
  onPress?: () => void;
}

export default function ArticleItem({
  article,
  onFavorite,
  isFavorite = false,
  onDelete,
  onUndo,
  onPress,
}: ArticleItemProps) {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      testID="article-item"
    >
      <Text style={styles.title}>{article.story_title}</Text>
      <Text style={styles.subtitle}>
        {article.author} - {new Date(article.created_at).toLocaleDateString()}
      </Text>

      <View style={styles.actions}>
        {onFavorite && (
          <TouchableOpacity
            onPress={() => onFavorite(article)}
            testID="favorite-icon"
          >
            <MaterialIcons
              name={isFavorite ? "star" : "star-border"}
              size={24}
              color={isFavorite ? "#FFD700" : "#333"}
            />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(article)}>
            <MaterialIcons name="delete" size={24} color="#f44336" />
          </TouchableOpacity>
        )}
        {onUndo && (
          <TouchableOpacity onPress={() => onUndo(article)}>
            <MaterialIcons name="undo" size={24} color="#4caf50" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
});
