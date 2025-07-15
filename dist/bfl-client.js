export class BFLClient {
    config;
    baseUrl;
    constructor(config) {
        this.config = config;
        this.baseUrl = config.baseUrl || 'https://api.bfl.ai';
    }
    async makeRequest(endpoint, body) {
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
    async pollForResult(requestId) {
        const maxAttempts = 60; // 5 minutes with 5-second intervals
        const pollInterval = 5000;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}/v1/get_result?id=${requestId}`, {
                    headers: {
                        'x-key': this.config.apiKey,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Poll error: ${response.status} - ${response.statusText}`);
                }
                const result = await response.json();
                if (result.status === 'Ready') {
                    return result;
                }
                else if (result.status === 'Error') {
                    throw new Error(`Generation failed: ${result.error || 'Unknown error'}`);
                }
                // Wait before next poll
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
            catch (error) {
                if (attempt === maxAttempts - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
        }
        throw new Error('Timeout: Image generation took too long');
    }
    async generateImage(request) {
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
            // Step 2: Poll for result
            const result = await this.pollForResult(response.id);
            if (!result.result?.sample) {
                throw new Error('No image URL in response');
            }
            return result.result.sample;
        }
        catch (error) {
            throw new Error(`Image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async editImage(request) {
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
            // Step 2: Poll for result
            const result = await this.pollForResult(response.id);
            if (!result.result?.sample) {
                throw new Error('No image URL in response');
            }
            return result.result.sample;
        }
        catch (error) {
            throw new Error(`Image editing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
//# sourceMappingURL=bfl-client.js.map