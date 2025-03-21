import { toast } from "@/components/ui/use-toast";

const COHERE_API_KEY = "LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97";
const COHERE_MODEL = "command-a-03-2025";

export const generateAnimation = async (prompt: string): Promise<{ html: string, css: string }> => {
  try {
    const systemPrompt = `You are an expert HTML/CSS animation creator. Your task is to convert user prompts into detailed, working HTML and CSS animations. Follow these strict guidelines:

1. Create ONLY HTML and CSS animations (no JavaScript).
2. Make the animation loop infinitely using CSS animations and keyframes.
3. Use clean, modern CSS with appropriate keyframes.
4. Ensure all animations are centered and responsive.
5. Optimize for performance using transform and opacity properties.
6. Keep the code clean and well-commented.
7. Return ONLY the raw HTML and CSS code, separated by a divider like "---CSS---".

Return EXACTLY this format (HTML first, then CSS after the divider):
<div class="scene">
  <!-- Animation elements here -->
</div>
---CSS---
.scene {
  /* Styling here */
}
/* Rest of the CSS with keyframes */`;

    const userMessage = `Create a captivating, looping animation showing: "${prompt}"

Requirements:
- Create a visually appealing scene using only HTML and CSS (no JavaScript)
- Ensure smooth, natural animation with proper timing and easing
- Make all animations loop perfectly
- Use creative design elements, colors, and shapes to bring the scene to life
- Add subtle details like shadows, gradients, or particle effects if appropriate
- Return just the HTML and CSS code separated by ---CSS---`;

    console.log("Sending enhanced request to Cohere...");

    const response = await chatWithCohere(userMessage, systemPrompt);
    
    const parts = response.split("---CSS---");
    
    const html = parts[0].trim();
    const css = parts[1].trim();
    
    return { html, css };
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    toast({
      title: "API Error",
      description: "There was an error connecting to the AI service. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

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