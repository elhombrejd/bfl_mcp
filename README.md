# BFL MCP Server

Model Context Protocol (MCP) server for Black Forest Labs image generation and editing using FLUX.1 Kontext.

## Features

- 🎨 **Image Generation**: Generate high-quality images from text prompts using FLUX.1 Kontext
- ✏️ **Image Editing**: Edit existing images with natural language instructions  
- 🚀 **Easy Installation**: Run directly with npx - no local setup required
- 🔧 **Configurable**: Support for aspect ratios, seeds, safety settings, and output formats

## Installation & Usage

### Quick Start with npx

```bash
# Run the MCP server with your BFL API key
npx @bfl/mcp-server YOUR_BFL_API_KEY
```

### Environment Variable

```bash
# Set environment variable
export BFL_API_KEY="your-api-key-here"
npx @bfl/mcp-server
```

### Claude Desktop Integration

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "bfl": {
      "command": "npx",
      "args": ["@bfl/mcp-server"],
      "env": {
        "BFL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

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
git clone <repository>
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

## License

MIT

## Support

For issues with the MCP server, please open an issue on GitHub.
For BFL API questions, visit [BFL Documentation](https://docs.bfl.ai/).