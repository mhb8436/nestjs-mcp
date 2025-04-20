import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from '@rekog/mcp-nest';
import { MovieTool } from './movie.tool';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    McpModule.forRoot({
      name: 'weather-mcp-server',
      version: '1.0.0',
      sse: {
        pingEnabled: true,
        pingIntervalMs: 30000,
      },
    }),
  ],
  providers: [MovieTool],
})
export class AppModule {}
