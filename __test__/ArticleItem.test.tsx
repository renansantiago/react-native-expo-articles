import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ArticleItem from "../app/components/ArticleItem";
import { Article } from "../app/types";

const sampleArticle: Article = {
  objectID: "1",
  story_title: "Test Article",
  author: "Author",
  created_at: new Date().toISOString(),
  story_url: "https://example.com",
};

describe("ArticleItem", () => {
  it("renders article title and author", () => {
    const { getByText } = render(<ArticleItem article={sampleArticle} />);
    expect(getByText("Test Article")).toBeTruthy();
    expect(getByText(/Author/)).toBeTruthy();
  });

  it("calls onFavorite when the favorite icon is pressed", () => {
    const onFavoriteMock = jest.fn();
    const { getByTestId } = render(
      <ArticleItem article={sampleArticle} onFavorite={onFavoriteMock} />
    );
    fireEvent.press(getByTestId("favorite-icon"));
    expect(onFavoriteMock).toHaveBeenCalledWith(sampleArticle);
  });

  it("calls onPress when article item is pressed", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <ArticleItem article={sampleArticle} onPress={onPressMock} />
    );
    fireEvent.press(getByTestId("article-item"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
