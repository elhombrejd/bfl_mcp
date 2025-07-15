#!/usr/bin/env node

import { BFLClient } from './dist/bfl-client.js';

const API_KEY = '1f8621e5-35d7-4451-a1ca-ef26a2f7184f';

async function testImageGeneration() {
  console.log('🧪 Testing BFL Image Generation...');
  
  const client = new BFLClient({ apiKey: API_KEY });
  
  try {
    console.log('📝 Generating image with prompt: "A beautiful sunset over mountains"');
    const imageUrl = await client.generateImage({
      prompt: 'A beautiful sunset over mountains',
      aspect_ratio: '16:9',
      output_format: 'jpeg'
    });
    
    console.log('✅ Image generated successfully!');
    console.log('🖼️  Image URL:', imageUrl);
    console.log('⏰ Note: URL is valid for 10 minutes');
    
    return imageUrl;
  } catch (error) {
    console.error('❌ Error generating image:', error.message);
    throw error;
  }
}

async function testImageEditing() {
  console.log('\n🧪 Testing BFL Image Editing...');
  
  // Create a simple test image in base64 (1x1 red pixel PNG)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  
  const client = new BFLClient({ apiKey: API_KEY });
  
  try {
    console.log('📝 Editing image with prompt: "Make this a blue pixel instead"');
    const imageUrl = await client.editImage({
      prompt: 'Make this a blue pixel instead',
      input_image: testImageBase64,
      aspect_ratio: '1:1',
      output_format: 'png'
    });
    
    console.log('✅ Image edited successfully!');
    console.log('🖼️  Edited image URL:', imageUrl);
    console.log('⏰ Note: URL is valid for 10 minutes');
    
    return imageUrl;
  } catch (error) {
    console.error('❌ Error editing image:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting BFL API Tests\n');
  
  try {
    // Test image generation
    await testImageGeneration();
    
    // Test image editing
    await testImageEditing();
    
    console.log('\n🎉 All tests passed successfully!');
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

main();