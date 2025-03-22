
import { toast } from "sonner";

const COHERE_API_KEY = 'LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97';
const COHERE_MODEL = 'command-a-03-2025';

export async function chatWithCohere(userMessage: string, systemPrompt?: string): Promise<string> {
  try {
    console.log('Sending message to Cohere:', { userMessage, systemPrompt });
    
    // Call Cohere API
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        message: userMessage,
        preamble: systemPrompt || "Keep your responses brief and concise, under 3 sentences when possible."
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received response from Cohere:', data);
    
    // Extract and return the AI's response
    return data.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    toast.error('Failed to connect to AI service');
    return "Sorry, I encountered an issue. Please try again later.";
  }
}

export async function generateAnimation(prompt: string): Promise<{ html: string, css: string }> {
  try {
    console.log('Sending enhanced request to Cohere...');
    
    const systemPrompt = `You are an expert HTML/CSS animation creator specializing in highly detailed, visually impressive animations. Your task is to convert user prompts into meticulous, working HTML and CSS animations following these strict guidelines:

1. Create ONLY pure HTML and CSS animations (absolutely no JavaScript).
2. Make all animations loop infinitely and seamlessly using CSS animations and keyframes.
3. Use modern CSS techniques including:
   - Multiple layered keyframe animations with different timing functions
   - Use of transform, opacity, filter, and clip-path for performance
   - CSS variables for flexible animation control
   - Complex pseudo-elements for added details without extra HTML
   - Blend modes and gradients for sophisticated visual effects

4. BUILD DETAILED OBJECTS:
   - Break down complex objects into many small, precise sub-components
   - Use dozens of tiny elements with specific positioning to create intricate details
   - Implement subtle variations in timing between related elements for natural movement
   - Use shadows, highlights, and perspective to create depth
   - Add micro-animations (slight movements, pulses, color shifts) for realism

5. CRAFT THE SCENE:
   - Create a complete environment with background elements, not just isolated objects
   - Add particle effects, textures, and atmospheric elements
   - Implement multiple animation layers moving at different speeds
   - Use z-index and positioning to create a sense of depth and perspective
   - Include subtle environmental animations (wind effects, lighting changes, etc.)

6. PERFORMANCE OPTIMIZATION:
   - Use will-change for elements that animate frequently
   - Prefer transform and opacity animations over other properties
   - Group related elements with composited animations
   - Use hardware acceleration through transform3d

7. Return ONLY the raw HTML and CSS code, separated by "---CSS---".
   DO NOT include \`\`\`html or \`\`\`css markers.
   DO NOT include any explanations before or after the code.

Return EXACTLY this format:
<div class="scene">
  <!-- Animation elements here with many nested components for detail -->
</div>
---CSS---
.scene {
  /* Scene styling */
}
/* Rest of the CSS with detailed keyframes */`;

    const userPrompt = `Create a captivating, looping animation showing: "${prompt}"

Requirements:
- Create an extremely detailed, visually appealing scene using only HTML and CSS (no JavaScript)
- Break down all objects into many small, precisely positioned elements to achieve remarkable detail
- Create natural movement with multiple layered animations running at different speeds and timings
- Use advanced CSS techniques: transform, clip-path, gradients, filters, and blend modes
- Add micro-animations and subtle details for realism (shadows, highlights, particle effects)
- Implement depth and perspective using z-indexing and creative positioning
- Ensure all animations loop perfectly with appropriate easing functions
- Return just the HTML and CSS code separated by ---CSS---`;

    const result = await chatWithCohere(userPrompt, systemPrompt);
    
    // Split the response into HTML and CSS parts
    const parts = result.split('---CSS---');
    
    if (parts.length !== 2) {
      throw new Error('Invalid response format from AI');
    }
    
    return {
      html: parts[0].trim(),
      css: parts[1].trim()
    };
  } catch (error) {
    console.error('Error generating animation:', error);
    toast.error('Failed to generate animation');
    throw error;
  }
}
