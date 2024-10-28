import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  saveArticles,
  loadArticles,
  saveFavoriteArticles,
  loadFavoriteArticles,
  saveDeletedArticles,
  loadDeletedArticles,
} from "../app/utils/storage";
import { Article } from "../app/types";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const sampleArticles: Article[] = [
  {
    objectID: "1",
    story_title: "Article 1",
    story_url: "https://example1.com",
    author: "Author1",
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    objectID: "2",
    story_title: "Article 2",
    story_url: "https://example2.com",
    author: "Author2",
    created_at: "2023-01-02T00:00:00Z",
  },
];

describe("storage utilities", () => {
  beforeEach(() => {
    AsyncStorage.clear();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() =>
      JSON.stringify(sampleArticles)
    );
  });

  it("saves and loads articles", async () => {
    await saveArticles(sampleArticles);
    const loadedArticles = await loadArticles();
    expect(loadedArticles).toEqual(sampleArticles);
  });

  it("saves and loads favorite articles", async () => {
    await saveFavoriteArticles(sampleArticles);
    const loadedFavorites = await loadFavoriteArticles();
    expect(loadedFavorites).toEqual(sampleArticles);
  });

  it("saves and loads deleted articles", async () => {
    await saveDeletedArticles(sampleArticles);
    const loadedDeleted = await loadDeletedArticles();
    expect(loadedDeleted).toEqual(sampleArticles);
  });
});
