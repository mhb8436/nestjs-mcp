import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Progress } from '@modelcontextprotocol/sdk/types';

import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Tool } from '@rekog/mcp-nest';

type ToolParams = {
  query?: string;
  year?: string;
  type?: 'movie' | 'series' | 'episode';
  imdbId?: string;
};

type ToolResult = { content: string };

@Injectable()
export class MovieTool {
  private readonly baseUrl = 'http://www.omdbapi.com/';
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OMDB_API_KEY');
    if (!apiKey) {
      throw new Error('OMDB_API_KEY is not defined');
    }
    this.apiKey = apiKey;
  }

  @Tool({
    name: 'search-movies',
    description: 'Search for movies by title',
    parameters: z.object({
      query: z.string().describe('Movie title to search for'),
      year: z.string().optional().describe('Year of release'),
      type: z
        .enum(['movie', 'series', 'episode'])
        .optional()
        .describe('Type of content'),
    }),
  })
  async searchMovies(
    params: ToolParams,
    reportProgress: (progress: number) => void,
  ): Promise<ToolResult> {
    reportProgress(0.1);
    const { query, year, type } = params;

    reportProgress(0.3);
    const response = await axios.get(this.baseUrl, {
      params: {
        apikey: this.apiKey,
        s: query,
        y: year,
        type,
      },
    });

    reportProgress(0.7);
    if (response.data.Response === 'False') {
      return {
        content: JSON.stringify({ error: response.data.Error }),
      };
    }

    const movies = response.data.Search.map((movie: any) => ({
      title: movie.Title,
      year: movie.Year,
      imdbId: movie.imdbID,
      type: movie.Type,
      poster: movie.Poster,
    }));

    reportProgress(1);
    return {
      content: JSON.stringify({ movies }),
    };
  }

  @Tool({
    name: 'get-movie-details',
    description: 'Get detailed information about a movie',
    parameters: z.object({
      imdbId: z.string().describe('IMDb ID of the movie'),
    }),
  })
  async getMovieDetails(
    params: ToolParams,
    reportProgress: (progress: number) => void,
  ): Promise<ToolResult> {
    reportProgress(0.1);
    const { imdbId } = params;

    reportProgress(0.3);
    const response = await axios.get(this.baseUrl, {
      params: {
        apikey: this.apiKey,
        i: imdbId,
        plot: 'full',
      },
    });

    reportProgress(0.7);
    if (response.data.Response === 'False') {
      return {
        content: JSON.stringify({ error: response.data.Error }),
      };
    }

    const movie = {
      title: response.data.Title,
      year: response.data.Year,
      rated: response.data.Rated,
      released: response.data.Released,
      runtime: response.data.Runtime,
      genre: response.data.Genre,
      director: response.data.Director,
      writer: response.data.Writer,
      actors: response.data.Actors,
      plot: response.data.Plot,
      language: response.data.Language,
      country: response.data.Country,
      awards: response.data.Awards,
      poster: response.data.Poster,
      ratings: response.data.Ratings,
      metascore: response.data.Metascore,
      imdbRating: response.data.imdbRating,
      imdbVotes: response.data.imdbVotes,
      imdbId: response.data.imdbID,
      type: response.data.Type,
      dvd: response.data.DVD,
      boxOffice: response.data.BoxOffice,
      production: response.data.Production,
      website: response.data.Website,
    };

    reportProgress(1);
    return {
      content: JSON.stringify({ movie }),
    };
  }
}
