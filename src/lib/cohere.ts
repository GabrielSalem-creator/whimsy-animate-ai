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
          systemPrompt || "Provide concise and well-formatted responses, keeping it under 3 sentences when possible.",
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
 */
export function getSavedAnimations(): AnimationData[] {
  const saved = localStorage.getItem('savedAnimations');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Deletes an animation by its ID from local storage.
 */
export function deleteAnimation(id: string): void {
  const savedAnimations = getSavedAnimations();
  const updatedAnimations = savedAnimations.filter((animation) => animation.id !== id);
  localStorage.setItem('savedAnimations', JSON.stringify(updatedAnimations));
}

/**
 * Generates an HTML and CSS animation based on a user-defined prompt.
 */
export async function generateAnimation(prompt: string): Promise<{ html: string; css: string }> {
  try {
    console.log('Sending enhanced request to Cohere...');

    // Enhanced system-level instructions
    const systemPrompt = `You are a highly skilled HTML/CSS animator focused on generating precise and visually compelling animations. Follow these strict guidelines:

1. **Object Precision:** Create ONLY the requested object with extreme detail. Exclude backgrounds or extra elements.
2. **Shape and Form:** Use smooth, organic shapes (e.g., border-radius, clip-path) for natural forms, avoiding basic rectangles or squares.
3. **Proportion Accuracy:** Maintain accurate proportions, such as head-to-body ratios for characters or animals.
4. **Detailed Components:** Break objects into many small components with pixel-perfect positioning, layering (z-index), and proper perspective.
5. **Visual Richness:** Use advanced CSS techniques like gradients, shadows, textures, and lighting for rich visual detail.
6. **Micro-Animations:** Implement micro-animations (subtle movements, color shifts) for realism, using keyframes and easing functions (e.g., cubic-bezier).
7. **Looping Animations:** Ensure infinite looping animations without distortion or separation of parts during motion.
8. **Viewpoint and Placement:** Consider the viewpoint and placement of the object within a virtual space. Use perspective and scaling to simulate depth and realistic positioning. Ensure that animations are visually appealing from multiple angles.

Return ONLY raw HTML and CSS code in this format:
<div class="object-container">
  <!-- Highly detailed object elements -->
</div>
---CSS---
.object-container {
  /* Container styling */
}
/* Detailed CSS with keyframes */`;

    // Enhanced user-specific request
    const userPrompt = `Create an EXTREMELY DETAILED animation of "${prompt}" considering these key aspects:

- Smooth and organic shapes achieved via clip-path and border-radius
- Accurate proportions and precise positioning, taking into account perspective
- Advanced visual details including gradients, shadows, and lighting
- Natural movement with bezier curve easing for realistic animation
- Infinite looping without errors
- Optimize the viewpoint and placement for enhanced visual appeal and depth

Ensure the animation is visually compelling and correctly positioned in the viewport.`;

    const result = await chatWithCohere(userPrompt, systemPrompt);

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
