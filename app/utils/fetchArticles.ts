import { Article } from "../types";

export async function fetchArticles(query: string): Promise<Article[]> {
  try {
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${query}`
    );
    const data = await response.json();
    return data.hits.map((item: any) => ({
      objectID: item.objectID,
      story_title: item.story_title || item.title || "Untitled",
      author: item.author,
      created_at: item.created_at,
      story_url: item.story_url || item.url || "#",
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}
