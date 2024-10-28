import React, { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ArticleItem from "../components/ArticleItem";
import {
  loadDeletedArticles,
  saveDeletedArticles,
  saveArticles,
  loadArticles,
} from "../utils/storage";
import { Article } from "../types";

export default function DeletedScreen() {
  const [deleted, setDeleted] = useState<Article[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const savedDeleted = await loadDeletedArticles();
        setDeleted(savedDeleted);
      })();
    }, [])
  );

  const handleUndoDelete = async (article: Article) => {
    const updatedDeleted = deleted.filter(
      (del) => del.objectID !== article.objectID
    );
    setDeleted(updatedDeleted);
    await saveDeletedArticles(updatedDeleted);

    const updatedArticles = await loadArticles();
    await saveArticles([...updatedArticles, article]);
  };

  return (
    <View style={styles.container}>
      {deleted.length === 0 ? (
        <Text style={styles.emptyText}>No deleted articles</Text>
      ) : (
        <FlatList
          data={deleted}
          keyExtractor={(item) => item.objectID}
          renderItem={({ item }) => (
            <ArticleItem article={item} onUndo={handleUndoDelete} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
});
