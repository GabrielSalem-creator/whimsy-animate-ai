
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

// Interface for animation data
export interface AnimationData {
  id: string;
  title: string;
  prompt: string;
  html: string;
  css: string;
  createdAt: number;
}

// Function to save animation to local storage
export function saveAnimation(title: string, prompt: string, html: string, css: string): AnimationData {
  // Get existing animations
  const savedAnimations = getSavedAnimations();
  
  // Create new animation object
  const newAnimation: AnimationData = {
    id: Date.now().toString(),
    title,
    prompt,
    html,
    css,
    createdAt: Date.now()
  };
  
  // Add to existing animations
  const updatedAnimations = [newAnimation, ...savedAnimations];
  
  // Save to local storage
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));
  
  return newAnimation;
}

// Function to get all saved animations
export function getSavedAnimations(): AnimationData[] {
  const saved = localStorage.getItem('savedAnimations');
  return saved ? JSON.parse(saved) : [];
}

// Function to delete an animation
export function deleteAnimation(id: string): void {
  const savedAnimations = getSavedAnimations();
  const updatedAnimations = savedAnimations.filter(animation => animation.id !== id);
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));
}

export async function generateAnimation(prompt: string): Promise<{ html: string, css: string }> {
  try {
    console.log('Sending enhanced request to Cohere...');
    
    const systemPrompt = `You are an expert HTML/CSS animation creator specializing in highly detailed, visually impressive animations. Your task is to convert user prompts into meticulous, working HTML and CSS animations following these strict guidelines:

1. CREATE ULTRA-PRECISE ANIMATIONS:
   - Triple-check your code to ensure it works perfectly 
   - Every animation must be flawlessly executed with no errors
   - Test all animations mentally to verify they work as described

2. CREATE ONLY pure HTML and CSS animations (absolutely no JavaScript).
   - All animations must loop infinitely and seamlessly using CSS animations and keyframes.
   - Use modern CSS techniques including 3D transforms, perspective, and complex timing functions.

3. BUILD EXTREMELY DETAILED OBJECTS:
   - Break down complex objects into dozens of tiny, precisely positioned sub-components
   - Use many small elements with exact positioning to achieve remarkable detail
   - Create micro-animations (slight movements, pulses, color shifts) for each sub-element
   - Implement subtle variations in timing between related elements for natural movement
   - Use shadows, highlights, gradients, and perspective to create depth and realism
   - Layer multiple elements to create complex shapes and interactions
   - Include intricate decorative elements that enhance the main animation

4. CRAFT COMPLETE SCENES:
   - Create full environments with background elements, not just isolated objects
   - Add particle effects, textures, atmospheric elements, and environmental details
   - Implement multiple animation layers moving at different speeds and depths
   - Use z-index and positioning strategically to create a sense of depth and perspective
   - Include subtle environmental animations (wind effects, lighting changes, etc.)
   - Create foreground, midground, and background elements for a complete scene

5. OPTIMIZE PERFORMANCE:
   - Use will-change for elements that animate frequently
   - Prefer transform and opacity animations over other properties
   - Group related elements with composited animations
   - Use hardware acceleration through transform3d
   - Ensure smooth animations with proper timing functions

6. Return ONLY the raw HTML and CSS code, separated by "---CSS---".
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

    const userPrompt = `Create an extraordinarily detailed, seamlessly looping animation showing: "${prompt}"

Requirements:
- Create an EXTREMELY PRECISE animation with meticulous attention to detail
- Break objects into dozens of small elements to achieve remarkable detail and precision
- Position everything with exact coordinates and dimensions
- Triple-check your code to ensure it works perfectly with no errors
- Create a complete scene with background, midground, and foreground elements
- Use advanced CSS techniques: transform, perspective, clip-path, gradients, filters, blend modes
- Add micro-animations to every element for incredible realism
- Implement depth with careful z-indexing and shadows
- Ensure all animations loop perfectly with appropriate easing functions
- Return just the HTML and CSS code separated by ---CSS---

Remember to be extremely precise with all measurements, positions, and timing to create a truly exceptional animation.`;

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
