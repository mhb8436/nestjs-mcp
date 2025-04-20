import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { Progress } from '@modelcontextprotocol/sdk/types';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class NewsTool {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('NEWS_API_KEY');
    if (!apiKey) {
      throw new Error('NEWS_API_KEY가 설정되지 않았습니다');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://newsapi.org/v2';
  }

  @Tool({
    name: 'search-news',
    description: '뉴스를 검색합니다',
    parameters: z.object({
      query: z.string().describe('검색어'),
      category: z
        .enum([
          'business',
          'entertainment',
          'general',
          'health',
          'science',
          'sports',
          'technology',
        ])
        .optional()
        .describe('카테고리'),
      language: z.string().optional().default('ko').describe('언어'),
      pageSize: z.number().optional().default(10).describe('결과 수'),
    }),
  })
  async searchNews({ query, category, language, pageSize }, context: Context) {
    try {
      await context.reportProgress({
        progress: 10,
        total: 100,
        message: '뉴스를 검색하는 중...',
      } as Progress);

      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: query,
          category,
          language,
          pageSize,
          apiKey: this.apiKey,
        },
      });

      await context.reportProgress({
        progress: 50,
        total: 100,
        message: '뉴스 정보를 처리하는 중...',
      } as Progress);

      const articles = response.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }));

      await context.reportProgress({
        progress: 100,
        total: 100,
        message: '완료!',
      } as Progress);

      return {
        content: [{ type: 'text', text: JSON.stringify(articles, null, 2) }],
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('뉴스를 가져오는데 실패했습니다');
    }
  }

  @Tool({
    name: 'get-headlines',
    description: '헤드라인 뉴스를 가져옵니다',
    parameters: z.object({
      category: z
        .enum([
          'business',
          'entertainment',
          'general',
          'health',
          'science',
          'sports',
          'technology',
        ])
        .optional()
        .describe('카테고리'),
      country: z.string().optional().default('kr').describe('국가'),
      pageSize: z.number().optional().default(10).describe('결과 수'),
    }),
  })
  async getHeadlines({ category, country, pageSize }, context: Context) {
    try {
      await context.reportProgress({
        progress: 10,
        total: 100,
        message: '헤드라인을 가져오는 중...',
      } as Progress);

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          category,
          country,
          pageSize,
          apiKey: this.apiKey,
        },
      });

      await context.reportProgress({
        progress: 50,
        total: 100,
        message: '헤드라인 정보를 처리하는 중...',
      } as Progress);

      const headlines = response.data.articles.map((article) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
      }));

      await context.reportProgress({
        progress: 100,
        total: 100,
        message: '완료!',
      } as Progress);

      return {
        content: [{ type: 'text', text: JSON.stringify(headlines, null, 2) }],
      };
    } catch (error) {
      console.error('Error fetching headlines:', error);
      throw new Error('헤드라인을 가져오는데 실패했습니다');
    }
  }
}
