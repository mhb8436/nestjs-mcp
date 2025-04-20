import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MovieTool } from "./movie.tool";
import { McpServerModule } from "@rekog/mcp-nest";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    McpServerModule.forRoot({
      tools: [MovieTool],
    }),
  ],
})
export class MovieMcpModule {}
