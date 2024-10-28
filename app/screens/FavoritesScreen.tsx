import React, { useState, useCallback } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ArticleItem from "../components/ArticleItem";
import { loadFavoriteArticles, saveFavoriteArticles } from "../utils/storage";
import { Article } from "../types";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const savedFavorites = await loadFavoriteArticles();
        setFavorites(savedFavorites);
      })();
    }, [])
  );

  const handleUnlike = async (article: Article) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.objectID !== article.objectID
    );
    setFavorites(updatedFavorites);
    await saveFavoriteArticles(updatedFavorites);
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorites added</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.objectID}
          renderItem={({ item }) => (
            <ArticleItem article={item} onFavorite={handleUnlike} isFavorite />
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
