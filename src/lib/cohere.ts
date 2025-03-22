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
        preamble: systemPrompt || "Keep responses concise and structured for optimal results."
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from Cohere:', data);

    return data.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error calling Cohere API:', error);
    toast.error('Failed to connect to AI service');
    return "Sorry, I encountered an issue. Please try again later.";
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
    console.log('Sending structured request to Cohere...');

    const systemPrompt = `You are a highly skilled HTML/CSS animation expert. Your task is to generate flawless HTML and CSS code for precise, well-structured, and realistic object animations.

**Key Requirements:**
1. **STRUCTURE & GROUPING**  
   - Break objects into logical sections for organized positioning.  
   - Use parent-child relationships with container divs to prevent misalignment.  
   - Group elements that should move together.  

2. **POSITIONING & PROPORTIONS**  
   - Use exact measurements (px, %, em) to maintain perfect alignment.  
   - Keep anatomical proportions correct (especially for characters or animals).  
   - Ensure objects stay aligned during movement.  

3. **MOVEMENT & ANIMATION**  
   - Use smooth, natural animations with bezier curve easing.  
   - Prevent elements from breaking apart or moving unpredictably.  
   - Implement micro-animations for realism (subtle pulses, color shifts).  

4. **VISUAL DETAILS**  
   - Apply gradients, shadows, and highlights to create depth.  
   - Use HSLA/RGBA for transparency where needed.  
   - Ensure smooth edges with clip-path and border-radius.  

5. **RETURN FORMAT**  
   - Output only HTML and CSS code, separated by "---CSS---".  
   - DO NOT include \`\`\`html or \`\`\`css markers.  
   - Ensure the animation works perfectly in modern browsers without JavaScript.`;

    const userPrompt = `Generate a high-quality, structured animation for the following object: "${prompt}".  

- Ensure all elements are precisely positioned relative to each other.  
- Maintain anatomical proportions if applicable.  
- Use smooth animations without misalignment.  
- Triple-check for errors.  
- Return only HTML and CSS, separated by "---CSS---".`;

    const result = await chatWithCohere(userPrompt, systemPrompt);

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
