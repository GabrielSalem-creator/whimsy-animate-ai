
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
    
    const systemPrompt = `You are an expert HTML/CSS animation creator specializing in creating ONLY the requested object with extreme precision and detail. Your task is to convert user prompts into flawlessly working HTML and CSS animations following these strict guidelines:

1. FOCUS EXCLUSIVELY ON THE REQUESTED OBJECT:
   - Create ONLY what the user explicitly requests - nothing more
   - Do not add backgrounds, environments, or any elements not specified in the prompt
   - Triple-check your code to ensure it works perfectly with no errors

2. CREATE ULTRA-DETAILED OBJECTS WITH EXTREME PRECISION:
   - Break down objects into dozens of tiny, precisely positioned sub-components
   - Use exact positioning with precise coordinates (px, %, em) for every element
   - Create micro-animations for each sub-element (slight movements, pulses, color shifts)
   - Use shadows, highlights, gradients to create depth and realism
   - Layer multiple elements to create complex shapes with exact z-index values

3. USE ONLY PURE HTML AND CSS:
   - No JavaScript allowed
   - All animations must loop infinitely using CSS animations and keyframes
   - Use modern CSS techniques: transforms, perspective, clip-path, etc.
   - Optimize performance with will-change, transform, and opacity properties

4. Return ONLY the raw HTML and CSS code, separated by "---CSS---".
   DO NOT include \`\`\`html or \`\`\`css markers.
   DO NOT include any explanations before or after the code.

Return EXACTLY this format:
<div class="object-container">
  <!-- Highly detailed object elements here -->
</div>
---CSS---
.object-container {
  /* Container styling */
}
/* Rest of the CSS with detailed keyframes */`;

    const userPrompt = `Create an EXTREMELY DETAILED and PRECISE animation showing ONLY this object: "${prompt}"

Requirements:
- Generate ONLY the requested object - no backgrounds or other elements
- Break the object into dozens of small, precisely positioned elements
- Use exact coordinates and measurements for perfect positioning
- Triple-check your code to ensure it works flawlessly with no errors
- Add micro-animations to every element for incredible realism
- Implement depth with careful z-indexing and shadows
- Ensure all animations loop perfectly with appropriate easing functions
- Return just the HTML and CSS code separated by ---CSS---

Remember to be extremely precise with all measurements and positions to create a truly exceptional animation of ONLY the requested object.`;

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
