import { Injectable } from "@nestjs/common";
import { Tool, Context } from "@rekog/mcp-nest";
import { z } from "zod";
import { Progress } from "@modelcontextprotocol/sdk/types";
import axios from "axios";

@Injectable()
export class BookTool {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = "https://openlibrary.org";
  }

  @Tool({
    name: "search-books",
    description: "책을 검색합니다",
    parameters: z.object({
      query: z.string().describe("검색어"),
      limit: z.number().optional().default(10).describe("결과 수"),
      language: z.string().optional().describe("언어"),
    }),
  })
  async searchBooks({ query, limit, language }, context: Context) {
    try {
      await context.reportProgress({
        progress: 10,
        total: 100,
        message: "책을 검색하는 중...",
      } as Progress);

      const response = await axios.get(`${this.baseUrl}/search.json`, {
        params: {
          q: query,
          limit,
          language,
        },
      });

      await context.reportProgress({
        progress: 50,
        total: 100,
        message: "책 정보를 처리하는 중...",
      } as Progress);

      const books = response.data.docs.map((book) => ({
        title: book.title,
        author: book.author_name?.[0] || "Unknown",
        publishYear: book.first_publish_year,
        isbn: book.isbn?.[0],
        coverUrl: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : null,
      }));

      await context.reportProgress({
        progress: 100,
        total: 100,
        message: "완료!",
      } as Progress);

      return {
        content: [{ type: "text", text: JSON.stringify(books, null, 2) }],
      };
    } catch (error) {
      console.error("Error fetching books:", error);
      throw new Error("책을 검색하는데 실패했습니다");
    }
  }

  @Tool({
    name: "get-book-details",
    description: "책의 상세 정보를 가져옵니다",
    parameters: z.object({
      isbn: z.string().describe("ISBN 번호"),
    }),
  })
  async getBookDetails({ isbn }, context: Context) {
    try {
      await context.reportProgress({
        progress: 10,
        total: 100,
        message: "책 정보를 가져오는 중...",
      } as Progress);

      const response = await axios.get(
        `${this.baseUrl}/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
      );

      await context.reportProgress({
        progress: 50,
        total: 100,
        message: "책 상세 정보를 처리하는 중...",
      } as Progress);

      const bookData = response.data[`ISBN:${isbn}`];
      const details = {
        title: bookData.title,
        authors: bookData.authors?.map((author) => author.name) || [],
        publishDate: bookData.publish_date,
        publishers: bookData.publishers,
        subjects: bookData.subjects,
        coverUrl: bookData.cover?.large || bookData.cover?.medium,
      };

      await context.reportProgress({
        progress: 100,
        total: 100,
        message: "완료!",
      } as Progress);

      return {
        content: [{ type: "text", text: JSON.stringify(details, null, 2) }],
      };
    } catch (error) {
      console.error("Error fetching book details:", error);
      throw new Error("책 상세 정보를 가져오는데 실패했습니다");
    }
  }
}
