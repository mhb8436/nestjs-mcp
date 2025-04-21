import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';

const GEEK_NEWS_URL = 'https://news.hada.io/';

// Create server instance
const server = new McpServer({
  name: 'geeknews',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

interface NewsItem {
  title: string;
  url: string;
  points: number;
  author: string;
  time: string;
  comments: number;
}

async function fetchGeekNews(): Promise<NewsItem[]> {
  try {
    const response = await axios.get(GEEK_NEWS_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const newsItems: NewsItem[] = [];

    $('.topic_row').each((_, element) => {
      const titleElement = $(element).find('.topic_title a');
      const title = titleElement.text().trim();
      const url = titleElement.attr('href') || '';
      const points =
        parseInt($(element).find('.topic_points').text().trim()) || 0;
      const author = $(element).find('.topic_author').text().trim();
      const time = $(element).find('.topic_time').text().trim();
      const comments =
        parseInt($(element).find('.topic_comments').text().trim()) || 0;

      newsItems.push({
        title,
        url,
        points,
        author,
        time,
        comments,
      });
    });

    return newsItems;
  } catch (error) {
    console.error('Error fetching GeekNews:', error);
    return [];
  }
}

function formatNewsItem(item: NewsItem): string {
  return [
    `제목: ${item.title}`,
    `URL: ${item.url}`,
    `포인트: ${item.points}`,
    `작성자: ${item.author}`,
    `시간: ${item.time}`,
    `댓글: ${item.comments}`,
    '---',
  ].join('\n');
}

// Register GeekNews tools
server.tool(
  'get-latest-news',
  'Get latest news from GeekNews',
  {},
  async () => {
    const newsItems = await fetchGeekNews();

    if (newsItems.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'Failed to retrieve news data',
          },
        ],
      };
    }

    const formattedNews = newsItems.map(formatNewsItem);
    const newsText = `Latest news from GeekNews:\n\n${formattedNews.join(
      '\n',
    )}`;

    return {
      content: [
        {
          type: 'text',
          text: newsText,
        },
      ],
    };
  },
);

server.tool(
  'search-news',
  'Search news by keyword',
  {
    keyword: z.string().describe('Keyword to search for'),
  },
  async ({ keyword }) => {
    const newsItems = await fetchGeekNews();
    const filteredItems = newsItems.filter((item) =>
      item.title.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (filteredItems.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No news found containing "${keyword}"`,
          },
        ],
      };
    }

    const formattedNews = filteredItems.map(formatNewsItem);
    const newsText = `Search results for "${keyword}":\n\n${formattedNews.join(
      '\n',
    )}`;

    return {
      content: [
        {
          type: 'text',
          text: newsText,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GeekNews MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
