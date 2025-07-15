import { BFLApiConfig, GenerateImageRequest, EditImageRequest } from './types.js';
export declare class BFLClient {
    private config;
    private baseUrl;
    constructor(config: BFLApiConfig);
    private makeRequest;
    private pollForResult;
    generateImage(request: GenerateImageRequest): Promise<string>;
    editImage(request: EditImageRequest): Promise<string>;
}
//# sourceMappingURL=bfl-client.d.ts.map