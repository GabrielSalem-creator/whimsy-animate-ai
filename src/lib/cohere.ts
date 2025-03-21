import { toast } from "@/components/ui/use-toast";

const COHERE_API_KEY = "LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97";
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

type CohereResponse = {
  text: string;
};

const simulateCohereResponse = async (prompt: string): Promise<CohereResponse> => {
  try {
    const response = await fetch(COHERE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${COHERE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 1000, // Adjust as needed
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from Cohere API");
    }

    const data = await response.json();
    
    // Assuming the response contains the text in the expected format
    return { text: data.text };
  } catch (error) {
    console.error("Error in simulateCohereResponse:", error);
    toast({
      title: "API Error",
      description: "There was an error connecting to the AI service. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
};

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

For sophisticated animations:
- Use multiple elements with varied animations for complex scenes
- Layer elements for depth and dimension
- Use pseudo-elements for additional details
- Implement realistic physics where appropriate (gravity, easing, etc.)
- Use gradient backgrounds and shadows for depth

When animating characters or objects:
- Break them down into individual elements (head, body, limbs, etc.)
- Use unique animations for each part
- Combine animations to create lifelike movement

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
    
    const response = await simulateCohereResponse(systemPrompt + userMessage);
    
    const parts = response.text.split("---CSS---");
    
    if (parts.length !== 2) {
      throw new Error("Invalid response format from AI");
    }
    
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