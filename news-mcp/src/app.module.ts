import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { McpModule } from "@rekog/mcp-nest";
import { NewsTool } from "./news.tool";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    McpModule.forRoot({
      name: "news-mcp-server",
      version: "1.0.0",
      sse: {
        pingEnabled: true,
        pingIntervalMs: 30000,
      },
    }),
  ],
  providers: [NewsTool],
})
export class AppModule {}
