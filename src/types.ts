export interface BFLApiConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface GenerateImageRequest {
  prompt: string;
  aspect_ratio?: string;
  seed?: number;
  safety_tolerance?: number;
  output_format?: 'jpeg' | 'png';
}

export interface EditImageRequest {
  prompt: string;
  input_image: string; // Base64 encoded image
  aspect_ratio?: string;
  seed?: number;
  safety_tolerance?: number;
  output_format?: 'jpeg' | 'png';
}

export interface BFLApiResponse {
  id: string;
  status: 'Ready' | 'Processing' | 'Error';
  result?: {
    sample?: string; // URL to the generated image
  };
  error?: string;
}

export interface PollResponse {
  id: string;
  status: 'Ready' | 'Processing' | 'Error';
  result?: {
    sample?: string;
  };
  error?: string;
}