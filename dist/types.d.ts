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
    input_image: string;
    aspect_ratio?: string;
    seed?: number;
    safety_tolerance?: number;
    output_format?: 'jpeg' | 'png';
}
export interface BFLApiResponse {
    id: string;
    status: 'Ready' | 'Processing' | 'Error';
    result?: {
        sample?: string;
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
//# sourceMappingURL=types.d.ts.map