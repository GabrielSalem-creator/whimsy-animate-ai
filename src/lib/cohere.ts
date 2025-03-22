import { toast } from "sonner";

const COHERE_API_KEY = 'LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97';
const COHERE_MODEL = 'command-a-03-2025';

export async function chatWithCohere(userMessage: string, systemPrompt?: string): Promise<string> {
  try {
    console.log('Sending message to Cohere:', { userMessage, systemPrompt });
    
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
        preamble: systemPrompt || "Provide concise responses, preferably under 3 sentences."
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received response from Cohere:', data);
    
    return data.text || "Unable to generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    toast.error('Failed to connect to AI service');
    return "An error occurred. Please try again later.";
  }
}

export interface AnimationData {
  id: string;
  title: string;
  prompt: string;
  html: string;
  css: string;
  createdAt: number;
}

export function saveAnimation(title: string, prompt: string, html: string, css: string): AnimationData {
  const savedAnimations = getSavedAnimations();
  
  const newAnimation: AnimationData = {
    id: Date.now().toString(),
    title,
    prompt,
    html,
    css,
    createdAt: Date.now()
  };
  
  const updatedAnimations = [newAnimation, ...savedAnimations];
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));
  
  return newAnimation;
}

export function getSavedAnimations(): AnimationData[] {
  const saved = localStorage.getItem('savedAnimations');
  return saved ? JSON.parse(saved) : [];
}

export function deleteAnimation(id: string): void {
  const savedAnimations = getSavedAnimations();
  const updatedAnimations = savedAnimations.filter(animation => animation.id !== id);
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));
}

export async function generateAnimation(prompt: string): Promise<{ html: string, css: string }> {
  try {
    console.log('Sending enhanced request to Cohere...');
    
    const systemPrompt = `As an expert HTML/CSS animator, create ONLY the requested object with extreme precision and detail. Follow these guidelines:

1. FOCUS EXCLUSIVELY ON THE REQUESTED OBJECT:
   - Create ONLY what is explicitly requested
   - No backgrounds or additional elements
   - Ensure code works flawlessly

2. CREATE ULTRA-DETAILED OBJECTS WITH CORRECT PROPORTIONS:
   - Use border-radius, clip-path, and SVG paths for organic shapes
   - Maintain proper proportions (e.g., correct head-to-body ratio)
   - Break objects into many precisely positioned sub-components
   - Use exact positioning and z-index for depth

3. PERFECT POSITION AND MOVEMENT:
   - Position elements with pixel-perfect precision
   - Maintain proper relative positions during animations
   - Use container elements for grouped movements
   - Implement micro-animations for realism
   - Ensure natural, fluid movements

4. DETAILED VISUAL ELEMENTS:
   - Use rich color palettes with gradients
   - Add shadows, highlights, and subtle textures
   - Implement transparency and blend modes

5. AVOID COMMON ERRORS:
   - Maintain correct proportions throughout animations
   - Prevent separation of connected parts
   - Ensure anatomical correctness

6. USE ONLY PURE HTML AND CSS:
   - No JavaScript
   - Infinite looping CSS animations
   - Optimize performance with modern CSS techniques

7. RETURN FORMAT:
<div class="object-container">
  <!-- Detailed object elements -->
</div>
---CSS---
.object-container {
  /* Container styling */
}
/* CSS with keyframes */`;

    const userPrompt = `Create an EXTREMELY DETAILED and PRECISE animation of: "${prompt}"
Requirements:
- ONLY the requested object
- Smooth, organic shapes with curved edges
- Anatomically correct proportions
- Perfect positioning and natural movement
- Dozens of precisely placed elements
- Advanced CSS techniques (clip-path, SVG paths, etc.)
- Detailed visuals (shadows, highlights, gradients, textures)
- Micro-animations for realism
- Proper depth with z-indexing
- Looping animations with appropriate easing
- Flawless, error-free code
Return HTML and CSS separated by ---CSS---`;

    const result = await chatWithCohere(userPrompt, systemPrompt);
    
    const parts = result.split('---CSS---');
    
    if (parts.length !== 2) {
      throw new Error('Invalid AI response format');
    }
    
    return {
      html: parts[0].trim(),
      css: parts[1].trim()
    };
  } catch (error) {
    console.error('Animation generation error:', error);
    toast.error('Failed to generate animation');
    throw error;
  }
}
