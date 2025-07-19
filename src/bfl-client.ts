import { BFLApiConfig, GenerateImageRequest, EditImageRequest, BFLApiResponse, PollResponse } from './types.js';

export class BFLClient {
  private config: BFLApiConfig;
  private baseUrl: string;

  constructor(config: BFLApiConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.bfl.ai';
  }

  private async makeRequest(endpoint: string, body: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-key': this.config.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`BFL API error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  private async pollForResult(requestId: string, pollingUrl?: string): Promise<BFLApiResponse> {
    const maxAttempts = 20; // 1 minute with 3-second intervals
    const pollInterval = 3000;

    console.log(`[BFL] Starting polling for request ${requestId} (max ${maxAttempts} attempts, ${pollInterval/1000}s intervals)`);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        console.log(`[BFL] Polling attempt ${attempt + 1}/${maxAttempts} for ${requestId}`);
        
        // Use polling URL if provided, otherwise construct from base URL
        const url = pollingUrl || `${this.baseUrl}/v1/get_result?id=${requestId}`;
        const response = await fetch(url, {
          headers: {
            'x-key': this.config.apiKey,
          },
        });

        if (!response.ok) {
          const errorMsg = `Poll error: ${response.status} - ${response.statusText}`;
          console.log(`[BFL] ${errorMsg}`);
          
          // Don't retry on client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw new Error(errorMsg);
          }
          
          throw new Error(errorMsg);
        }

        const result: PollResponse = await response.json();
        console.log(`[BFL] Status: ${result.status}`);

        if (result.status === 'Ready') {
          console.log(`[BFL] ✅ Image generation completed for ${requestId}`);
          return result;
        } else if (result.status === 'Error') {
          const errorMsg = `Generation failed: ${result.error || 'Unknown error'}`;
          console.log(`[BFL] ❌ ${errorMsg}`);
          throw new Error(errorMsg);
        } else if (result.status === 'Processing' || result.status === 'Pending') {
          console.log(`[BFL] ⏳ Still ${result.status.toLowerCase()}, waiting ${pollInterval/1000}s...`);
        }

        // Wait before next poll (only if not last attempt)
        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        }
      } catch (error) {
        console.log(`[BFL] Error on attempt ${attempt + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        if (attempt === maxAttempts - 1) {
          console.log(`[BFL] ❌ Final attempt failed, giving up`);
          throw error;
        }
        
        // For network errors, wait before retry
        if (error instanceof Error && !error.message.includes('Poll error: 4')) {
          console.log(`[BFL] Retrying in ${pollInterval/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, pollInterval));
        } else {
          // Don't retry 4xx errors
          throw error;
        }
      }
    }

    const timeoutMsg = `Timeout: Image generation exceeded ${maxAttempts * pollInterval / 1000}s limit`;
    console.log(`[BFL] ❌ ${timeoutMsg}`);
    throw new Error(timeoutMsg);
  }

  async generateImage(request: GenerateImageRequest): Promise<string> {
    try {
      // Step 1: Submit generation request
      const response = await this.makeRequest('/v1/flux-kontext-pro', {
        prompt: request.prompt,
        aspect_ratio: request.aspect_ratio || '1:1',
        seed: request.seed,
        safety_tolerance: request.safety_tolerance,
        output_format: request.output_format || 'jpeg',
      });

      if (!response.id) {
        throw new Error('No request ID received from BFL API');
      }

      // Log the polling URL if provided
      if (response.polling_url) {
        console.log(`[BFL] Using polling URL: ${response.polling_url}`);
      }

      // Step 2: Poll for result
      const result = await this.pollForResult(response.id, response.polling_url);

      if (!result.result?.sample) {
        throw new Error('No image URL in response');
      }

      return result.result.sample;
    } catch (error) {
      throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async editImage(request: EditImageRequest): Promise<string> {
    try {
      // Step 1: Submit editing request
      const response = await this.makeRequest('/v1/flux-kontext-pro', {
        prompt: request.prompt,
        input_image: request.input_image,
        aspect_ratio: request.aspect_ratio || '1:1',
        seed: request.seed,
        safety_tolerance: request.safety_tolerance,
        output_format: request.output_format || 'jpeg',
      });

      if (!response.id) {
        throw new Error('No request ID received from BFL API');
      }

      // Log the polling URL if provided
      if (response.polling_url) {
        console.log(`[BFL] Using polling URL: ${response.polling_url}`);
      }

      // Step 2: Poll for result
      const result = await this.pollForResult(response.id, response.polling_url);

      if (!result.result?.sample) {
        throw new Error('No image URL in response');
      }

      return result.result.sample;
    } catch (error) {
      throw new Error(`Image editing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}