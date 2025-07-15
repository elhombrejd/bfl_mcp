#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { BFLClient } from './bfl-client.js';
// Get API key from environment or command line
const API_KEY = process.env.BFL_API_KEY || process.argv[2];
if (!API_KEY) {
    console.error('Error: BFL API key is required. Set BFL_API_KEY environment variable or pass as first argument.');
    process.exit(1);
}
// Initialize BFL client
const bflClient = new BFLClient({ apiKey: API_KEY });
// Create MCP server
const server = new Server({
    name: 'bfl-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Define tools
const tools = [
    {
        name: 'generate_image',
        description: 'Generate an image using FLUX.1 Kontext model based on a text prompt',
        inputSchema: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Text description of the image to generate',
                },
                aspect_ratio: {
                    type: 'string',
                    description: 'Aspect ratio of the image (e.g., "1:1", "16:9", "9:16")',
                    default: '1:1',
                },
                seed: {
                    type: 'number',
                    description: 'Seed for reproducible generation',
                },
                safety_tolerance: {
                    type: 'number',
                    description: 'Safety tolerance level (0-6)',
                    minimum: 0,
                    maximum: 6,
                },
                output_format: {
                    type: 'string',
                    enum: ['jpeg', 'png'],
                    description: 'Output image format',
                    default: 'jpeg',
                },
            },
            required: ['prompt'],
        },
    },
    {
        name: 'edit_image',
        description: 'Edit an existing image using FLUX.1 Kontext model based on a text prompt',
        inputSchema: {
            type: 'object',
            properties: {
                prompt: {
                    type: 'string',
                    description: 'Text description of how to edit the image',
                },
                input_image: {
                    type: 'string',
                    description: 'Base64 encoded input image to edit',
                },
                aspect_ratio: {
                    type: 'string',
                    description: 'Aspect ratio of the output image (e.g., "1:1", "16:9", "9:16")',
                    default: '1:1',
                },
                seed: {
                    type: 'number',
                    description: 'Seed for reproducible generation',
                },
                safety_tolerance: {
                    type: 'number',
                    description: 'Safety tolerance level (0-6)',
                    minimum: 0,
                    maximum: 6,
                },
                output_format: {
                    type: 'string',
                    enum: ['jpeg', 'png'],
                    description: 'Output image format',
                    default: 'jpeg',
                },
            },
            required: ['prompt', 'input_image'],
        },
    },
];
// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools,
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (!args) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'Error: No arguments provided',
                },
            ],
            isError: true,
        };
    }
    try {
        switch (name) {
            case 'generate_image': {
                const imageUrl = await bflClient.generateImage({
                    prompt: args.prompt,
                    aspect_ratio: args.aspect_ratio,
                    seed: args.seed,
                    safety_tolerance: args.safety_tolerance,
                    output_format: args.output_format,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Image generated successfully! URL: ${imageUrl}\n\nNote: The URL is valid for 10 minutes.`,
                        },
                    ],
                };
            }
            case 'edit_image': {
                const imageUrl = await bflClient.editImage({
                    prompt: args.prompt,
                    input_image: args.input_image,
                    aspect_ratio: args.aspect_ratio,
                    seed: args.seed,
                    safety_tolerance: args.safety_tolerance,
                    output_format: args.output_format,
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Image edited successfully! URL: ${imageUrl}\n\nNote: The URL is valid for 10 minutes.`,
                        },
                    ],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('BFL MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map