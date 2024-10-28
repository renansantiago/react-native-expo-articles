import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article } from "../types";

const saveData = async (key: string, data: Article[]) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

const loadData = async (key: string): Promise<Article[]> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return [];
  }
};

export const saveArticles = async (articles: Article[]) =>
  saveData("articles", articles);
export const loadArticles = async () => loadData("articles");

export const saveFavoriteArticles = async (articles: Article[]) =>
  saveData("favorites", articles);
export const loadFavoriteArticles = async () => loadData("favorites");

export const saveDeletedArticles = async (articles: Article[]) =>
  saveData("deleted", articles);
export const loadDeletedArticles = async () => loadData("deleted");
