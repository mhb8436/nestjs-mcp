import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const OWM_API_BASE = 'https://api.openweathermap.org/data/2.5';
const OWM_API_KEY = process.env.OWM_API_KEY; // 환경변수에서 API 키를 가져옵니다

// Create server instance
const server = new McpServer({
  name: 'weather',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeOWMRequest<T>(
  endpoint: string,
  params: Record<string, string>,
): Promise<T | null> {
  if (!OWM_API_KEY) {
    throw new Error('OpenWeatherMap API key is not set');
  }

  const queryParams = new URLSearchParams({
    ...params,
    appid: OWM_API_KEY,
    units: 'metric', // 섭씨 단위 사용
  });

  const url = `${OWM_API_BASE}/${endpoint}?${queryParams.toString()}`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}`);
    }
    return (await resp.json()) as T;
  } catch (e) {
    console.error(`error making OWM request: ${e}`);
    return null;
  }
}

interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
}

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    main: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
}

// Register weather tools
server.tool(
  'get-alerts',
  'Get weather alerts for a location',
  {
    latitude: z.number().min(-90).max(90).describe('Latitude of the location'),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe('Longitude of the location'),
  },
  async ({ latitude, longitude }) => {
    const alertsData = await makeOWMRequest<{ alerts: WeatherAlert[] }>(
      'onecall',
      {
        lat: latitude.toString(),
        lon: longitude.toString(),
        exclude: 'current,minutely,hourly,daily',
      },
    );

    if (!alertsData) {
      return {
        content: [
          {
            type: 'text',
            text: 'Failed to retrieve alerts data',
          },
        ],
      };
    }

    const alerts = alertsData.alerts || [];
    if (alerts.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No active alerts for this location',
          },
        ],
      };
    }

    const formattedAlerts = alerts.map((alert) =>
      [
        `Event: ${alert.event}`,
        `From: ${new Date(alert.start * 1000).toLocaleString()}`,
        `To: ${new Date(alert.end * 1000).toLocaleString()}`,
        `Description: ${alert.description}`,
        '---',
      ].join('\n'),
    );

    const alertsText = `Active alerts for this location:\n\n${formattedAlerts.join(
      '\n',
    )}`;

    return {
      content: [
        {
          type: 'text',
          text: alertsText,
        },
      ],
    };
  },
);

server.tool(
  'get-forecast',
  'Get weather forecast for a location',
  {
    latitude: z.number().min(-90).max(90).describe('Latitude of the location'),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe('Longitude of the location'),
  },
  async ({ latitude, longitude }) => {
    const weatherData = await makeOWMRequest<WeatherData>('weather', {
      lat: latitude.toString(),
      lon: longitude.toString(),
    });

    if (!weatherData) {
      return {
        content: [
          {
            type: 'text',
            text: 'Failed to retrieve weather data',
          },
        ],
      };
    }

    const forecastText = [
      `Current weather for ${weatherData.name}:`,
      `Temperature: ${weatherData.main.temp}°C (feels like ${weatherData.main.feels_like}°C)`,
      `Humidity: ${weatherData.main.humidity}%`,
      `Weather: ${weatherData.weather[0].description}`,
      `Wind: ${weatherData.wind.speed} m/s at ${weatherData.wind.deg}°`,
    ].join('\n');

    return {
      content: [
        {
          type: 'text',
          text: forecastText,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Weather MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
