# BFL MCP Server

Model Context Protocol (MCP) server for Black Forest Labs FLUX image generation and editing using FLUX.1 Kontext Pro.

> 🎨 **Create and edit images with AI using natural language through the MCP protocol**

## Features

- 🎨 **Image Generation**: Generate high-quality images from text prompts using FLUX.1 Kontext Pro
- ✏️ **Image Editing**: Edit existing images with natural language instructions  
- 🚀 **Easy Installation**: Run directly with npx - no local setup required
- 🔧 **Configurable**: Support for aspect ratios, seeds, safety settings, and output formats
- 🔗 **MCP Compatible**: Works with Claude Desktop, Claude Code, and other MCP clients

## Installation & Usage

### Quick Start with npx

```bash
# Run the MCP server with your BFL API key
npx bfl-mcp-server YOUR_BFL_API_KEY
```

### Environment Variable

```bash
# Set environment variable
export BFL_API_KEY="your-api-key-here"
npx bfl-mcp-server
```

## IDE Integration

### Claude Desktop

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["bfl-mcp-server"],
      "env": {
        "BFL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Claude Code

1. **Via CLI Wizard** (Recommended):
```bash
claude mcp add bfl-server -e BFL_API_KEY=your-api-key-here -- npx bfl-mcp-server
```

2. **Via .claude.json** (Project-specific):
Create or edit `.claude.json` in your project root:
```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["bfl-mcp-server"],
      "env": {
        "BFL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

3. **Using Environment Variables**:
```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["bfl-mcp-server"],
      "env": {
        "BFL_API_KEY": "${BFL_API_KEY}"
      }
    }
  }
}
```

### Cursor IDE

1. **Enable MCP**: Go to Settings > Cursor Settings > MCP Servers and enable it

2. **Project Configuration**: Create `.cursor/mcp.json` in your project:
```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["-y", "bfl-mcp-server"],
      "env": {
        "BFL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

3. **Global Configuration**: Create `~/.cursor/mcp.json` for system-wide access:
```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["-y", "bfl-mcp-server"],
      "env": {
        "BFL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Windsurf IDE

1. **Via Plugin Store**: 
   - Open Windsurf and navigate to Cascade assistant
   - Click the Plugins icon in the top right menu
   - Add custom server with our package

2. **Manual Configuration**: 
   - Click the hammer (MCP) icon in Cascade
   - Click "Configure" to open `~/.codeium/windsurf/mcp_config.json`
   - Add configuration:
```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["-y", "bfl-mcp-server"],
      "env": {
        "BFL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

3. **Reload**: Save and click "Refresh" in the Cascade assistant

## Available Tools

### `generate_image`

Generate an image from a text prompt.

**Parameters:**
- `prompt` (required): Text description of the image to generate
- `aspect_ratio` (optional): Image aspect ratio (default: "1:1")
  - Supported: "1:1", "16:9", "9:16", "4:3", "3:4", etc.
- `seed` (optional): Seed for reproducible generation
- `safety_tolerance` (optional): Safety level 0-6 (higher = more permissive)
- `output_format` (optional): "jpeg" or "png" (default: "jpeg")

**Example:**
```json
{
  "name": "generate_image",
  "arguments": {
    "prompt": "A beautiful sunset over mountains with a lake reflection",
    "aspect_ratio": "16:9",
    "output_format": "jpeg"
  }
}
```

### `edit_image`

Edit an existing image using natural language instructions.

**Parameters:**
- `prompt` (required): Text description of how to edit the image
- `input_image` (required): Base64 encoded input image
- `aspect_ratio` (optional): Output image aspect ratio (default: "1:1")
- `seed` (optional): Seed for reproducible generation
- `safety_tolerance` (optional): Safety level 0-6
- `output_format` (optional): "jpeg" or "png" (default: "jpeg")

**Example:**
```json
{
  "name": "edit_image",
  "arguments": {
    "prompt": "Change the sky to be stormy with dark clouds",
    "input_image": "base64-encoded-image-data",
    "aspect_ratio": "16:9"
  }
}
```

## Verification & Troubleshooting

### Verify Installation

After configuring in any IDE, you should see:

- **Claude Desktop**: MCP tools available in chat
- **Claude Code**: Run `/mcp` command to check status  
- **Cursor**: Green dot with tools list in MCP section
- **Windsurf**: Tools available in Cascade assistant

### Common Issues

1. **"Command not found"**: Ensure npx is installed (`npm install -g npm`)
2. **"Permission denied"**: Try with `sudo` or check Node.js permissions  
3. **"API key invalid"**: Verify your BFL API key at [bfl.ai](https://bfl.ai)
4. **"Server not starting"**: Check IDE logs for detailed error messages

### Testing the Server

Test manually before IDE integration:
```bash
# Test the server directly
npx bfl-mcp-server your-api-key

# Should show: "BFL MCP Server running on stdio"
```

## API Key

Get your API key from [Black Forest Labs](https://bfl.ai/pricing/api).

## Technical Details

- **Model**: FLUX.1 Kontext Pro
- **Output**: ~1MP images (1024x1024 for 1:1 ratio)
- **URL Validity**: Generated image URLs are valid for 10 minutes
- **Processing**: Asynchronous with automatic polling
- **Timeout**: 5 minutes maximum generation time

## Development

### Local Development

```bash
# Clone and install
git clone https://github.com/elhombrehd/bfl_mcp.git
cd bfl_mcp
npm install

# Build
npm run build

# Test with API key
BFL_API_KEY="your-key" npm run dev
```

### Testing

```bash
# Run API tests
node test.js
```

## Author

Created by **[@elhombrehd](https://github.com/elhombrehd)**

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- **Issues**: [GitHub Issues](https://github.com/elhombrehd/bfl_mcp/issues)
- **BFL API Documentation**: [docs.bfl.ai](https://docs.bfl.ai/)
- **MCP Protocol**: [Model Context Protocol](https://github.com/modelcontextprotocol)

## Repository

🔗 **GitHub**: [github.com/elhombrehd/bfl_mcp](https://github.com/elhombrehd/bfl_mcp)