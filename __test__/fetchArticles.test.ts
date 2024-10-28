import { fetchArticles } from "../app/utils/fetchArticles";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        hits: [
          {
            objectID: "1",
            story_title: "Test Article",
            story_url: "https://example.com",
            created_at: "2023-01-01T00:00:00Z",
            author: "Author",
          },
        ],
      }),
  })
) as jest.Mock;

describe("fetchArticles", () => {
  it("fetches and returns articles", async () => {
    const articles = await fetchArticles("mobile");
    expect(articles).toHaveLength(1);
    expect(articles[0].story_title).toBe("Test Article");
    expect(articles[0].story_url).toBe("https://example.com");
  });

  it("handles fetch errors gracefully", async () => {
    // Mock console.error to prevent error output in test console
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject("API is down")
    );
    const articles = await fetchArticles("mobile");
    expect(articles).toEqual([]);

    // Restore console.error
    consoleErrorMock.mockRestore();
  });
});
