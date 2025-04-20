import { Injectable } from '@nestjs/common';
import { Tool, Context } from '@rekog/mcp-nest';
import { z } from 'zod';
import { Progress } from '@modelcontextprotocol/sdk/types';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WeatherTool {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OPENWEATHER_API_KEY is not defined');
    }
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  @Tool({
    name: 'get-weather',
    description: '현재 날씨 정보를 조회합니다',
    parameters: z.object({
      location: z.string().describe('위치 (예: Seoul)'),
      units: z
        .enum(['metric', 'imperial'])
        .optional()
        .default('metric')
        .describe('단위 시스템'),
      lang: z.string().optional().default('ko').describe('언어'),
    }),
  })
  async getWeather({ location, units, lang }, context: Context) {
    try {
      // 진행 상황 보고
      await context.reportProgress({
        progress: 10,
        total: 100,
        message: '날씨 정보를 가져오는 중...',
      } as Progress);

      const response = await axios.get(this.baseUrl, {
        params: {
          q: location,
          appid: this.apiKey,
          units: units || 'metric',
          lang: lang || 'ko',
        },
      });

      await context.reportProgress({
        progress: 50,
        total: 100,
        message: '날씨 정보를 처리하는 중...',
      } as Progress);

      const weatherData = response.data;
      const result = {
        temperature: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        location: `${weatherData.name}, ${weatherData.sys.country}`,
        timestamp: new Date().toISOString(),
      };

      await context.reportProgress({
        progress: 100,
        total: 100,
        message: '완료!',
      } as Progress);

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('날씨 정보를 가져오는데 실패했습니다');
    }
  }
}
