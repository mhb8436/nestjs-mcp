import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Create server instance
const server = new McpServer({
  name: 'hello-world',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register a simple hello world tool
server.tool(
  'say-hello',
  'Say hello to someone',
  {
    name: z.string().describe('Name of the person to greet'),
  },
  async ({ name }) => {
    return {
      content: [
        {
          type: 'text',
          text: `Hello, ${name}! Welcome to MCP!`,
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Hello World MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
