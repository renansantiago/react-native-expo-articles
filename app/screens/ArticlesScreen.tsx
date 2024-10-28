import React, { useState, useCallback } from "react";
import { View, FlatList, Text, RefreshControl, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { fetchArticles } from "../utils/fetchArticles";
import {
  saveArticles,
  loadArticles,
  saveFavoriteArticles,
  loadFavoriteArticles,
  saveDeletedArticles,
  loadDeletedArticles,
} from "../utils/storage";
import ArticleItem from "../components/ArticleItem";
import { Article } from "../types";
import { RootStackParamList } from "../types/navigation";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ArticlesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Articles"
>;

export default function ArticlesScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation<ArticlesScreenNavigationProp>();

  const getPlatformPreference = async (): Promise<string> => {
    const preference = await AsyncStorage.getItem("platformPreference");
    return preference || "mobile";
  };

  const loadData = async () => {
    const platformPreference = await getPlatformPreference();
    const articles = await fetchArticles(platformPreference);
    articles.sort(
      (a: Article, b: Article) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setArticles(articles);
    await saveArticles(articles);

    const savedFavorites = await loadFavoriteArticles();
    setFavorites(savedFavorites);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const platformPreference = await getPlatformPreference();
        const offlineArticles = await loadArticles();
        offlineArticles.sort(
          (a: Article, b: Article) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setArticles(
          offlineArticles.length
            ? offlineArticles
            : await fetchArticles(platformPreference)
        );
        setFavorites(await loadFavoriteArticles());
      })();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDelete = async (article: Article) => {
    const updatedArticles = articles.filter(
      (a) => a.objectID !== article.objectID
    );
    setArticles(updatedArticles);
    await saveArticles(updatedArticles);

    const deletedArticles = await loadDeletedArticles();
    await saveDeletedArticles([...deletedArticles, article]);
  };

  const handleFavorite = async (article: Article) => {
    const isAlreadyFavorite = favorites.some(
      (fav) => fav.objectID === article.objectID
    );
    const updatedFavorites = isAlreadyFavorite
      ? favorites.filter((fav) => fav.objectID !== article.objectID)
      : [...favorites, article];

    setFavorites(updatedFavorites);
    await saveFavoriteArticles(updatedFavorites);
  };

  const handlePressArticle = (article: Article) => {
    if (article.story_url) {
      navigation.navigate("ArticleDetail", { url: article.story_url });
    }
  };

  const renderRightActions = (article: Article) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => handleDelete(article)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </RectButton>
  );

  return (
    <View style={styles.container}>
      {articles.length === 0 ? (
        <Text style={styles.emptyText}>No articles available</Text>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.objectID}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item)}>
              <ArticleItem
                article={item}
                onFavorite={handleFavorite}
                isFavorite={favorites.some(
                  (fav) => fav.objectID === item.objectID
                )}
                onPress={() => handlePressArticle(item)}
              />
            </Swipeable>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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
  deleteButton: {
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
