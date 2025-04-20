import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { McpModule } from "@rekog/mcp-nest";
import { BookTool } from "./book.tool";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    McpModule.forRoot({
      name: "book-mcp-server",
      version: "1.0.0",
      sse: {
        pingEnabled: true,
        pingIntervalMs: 30000,
      },
    }),
  ],
  providers: [BookTool],
})
export class AppModule {}
