import { toast } from "sonner";

const COHERE_API_KEY = 'LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97';
const COHERE_MODEL = 'command-a-03-2025';

export interface AnimationData {
  id: string;
  title: string;
  prompt: string;
  html: string;
  css: string;
  createdAt: number;
}

/**
 * Function to communicate with the Cohere API.
 * @param userMessage - The user's input message.
 * @param systemPrompt - Optional system-level instructions for the AI.
 * @returns The AI-generated response as a string.
 */
export async function chatWithCohere(userMessage: string, systemPrompt?: string): Promise<string> {
  try {
    console.log('Sending message to Cohere:', { userMessage, systemPrompt });

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: COHERE_MODEL,
        message: userMessage,
        preamble:
          systemPrompt || "Provide concise responses with clear formatting. Keep it under 3 sentences when possible.",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status code: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from Cohere:', data);

    return data.text || "Unable to generate a response. Please try again.";
  } catch (error) {
    console.error('Error communicating with Cohere API:', error);
    toast.error('Failed to connect to the AI service.');
    return "An error occurred while processing your request. Please try again later.";
  }
}

/**
 * Saves an animation to local storage.
 * @param title - The title of the animation.
 * @param prompt - The prompt used to generate the animation.
 * @param html - The generated HTML code.
 * @param css - The generated CSS code.
 * @returns The saved animation data object.
 */
export function saveAnimation(title: string, prompt: string, html: string, css: string): AnimationData {
  const savedAnimations = getSavedAnimations();

  const newAnimation: AnimationData = {
    id: Date.now().toString(),
    title,
    prompt,
    html,
    css,
    createdAt: Date.now(),
  };

  const updatedAnimations = [newAnimation, ...savedAnimations];
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));

  return newAnimation;
}

/**
 * Retrieves all saved animations from local storage.
 * @returns An array of saved animations.
 */
export function getSavedAnimations(): AnimationData[] {
  const saved = localStorage.getItem('savedAnimations');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Deletes an animation by its ID from local storage.
 * @param id - The ID of the animation to delete.
 */
export function deleteAnimation(id: string): void {
  const savedAnimations = getSavedAnimations();
  const updatedAnimations = savedAnimations.filter((animation) => animation.id !== id);
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));
}

/**
 * Generates an HTML and CSS animation based on a user-defined prompt.
 * @param prompt - The description of the object or animation to generate.
 * @returns An object containing the generated HTML and CSS code.
 */
export async function generateAnimation(prompt: string): Promise<{ html: string; css: string }> {
  try {
    console.log('Sending detailed request to Cohere...');

    // System-level instructions for generating animations
    const systemPrompt = `You are a highly skilled HTML/CSS animator. Follow these strict guidelines:
1. Create ONLY the requested object with extreme precision—no backgrounds or extra elements.
2. Use smooth, organic shapes (e.g., border-radius, clip-path) for natural forms—avoid basic rectangles or squares.
3. Maintain accurate proportions (e.g., head-to-body ratio for animals).
4. Break objects into many small components with pixel-perfect positioning and layering (z-index).
5. Use advanced CSS techniques like gradients, shadows, and textures for rich visual detail.
6. Implement micro-animations (subtle movements, color shifts) for realism using keyframes and easing functions (e.g., cubic-bezier).
7. Ensure infinite looping animations without distortion or separation of parts during motion.

Return ONLY raw HTML and CSS code in this format:
<div class="object-container">
  <!-- Highly detailed object elements -->
</div>
---CSS---
.object-container {
  /* Container styling */
}
/* Detailed CSS with keyframes */`;

    // User-specific request
    const userPrompt = `Create an EXTREMELY DETAILED animation of "${prompt}" with:
- Smooth shapes using clip-path and border-radius
- Accurate proportions and precise positioning
- Advanced visual details (gradients, shadows)
- Natural movement with bezier curve easing
- Infinite looping without errors`;

    // Fetching response from Cohere API
    const result = await chatWithCohere(userPrompt, systemPrompt);

    // Splitting AI response into HTML and CSS parts
    const parts = result.split('---CSS---');
    if (parts.length !== 2) {
      throw new Error('Invalid response format from AI.');
    }

    return {
      html: parts[0].trim(),
      css: parts[1].trim(),
    };
  } catch (error) {
    console.error('Error generating animation:', error);
    toast.error('Failed to generate animation.');
    throw error;
  }
}
