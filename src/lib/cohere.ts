import { toast } from "@/components/ui/use-toast";
const { CohereClientV2 } = require('cohere-ai');

const COHERE_API_KEY = "LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97";

// Initialize the Cohere client
const cohere = new CohereClientV2({
  token: COHERE_API_KEY,
});

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

    // Send the request to the Cohere API using the CohereClientV2
    const response = await cohere.chat({
      model: 'command-a-03-2025',
      messages: [
        { role: 'user', content: `${systemPrompt}\n\n${userMessage}` },
      ],
    });

    // Log the response from the model
    console.log("Cohere API Response:", response);

    // Check if the response is valid
    if (!response || !response.generations || response.generations.length === 0) {
      throw new Error("Invalid response format from AI");
    }

    const data = response.generations[0].text; // Get the generated text
    console.log("Generated Text:", data); // Log the generated text

    const parts = data.split("---CSS---");

    if (parts.length !== 2) {
      throw new Error("Invalid response format from AI");
    }

    const html = parts[0].trim();
    const css = parts[1].trim();

    // Log the generated HTML and CSS
    console.log("Generated HTML:", html);
    console.log("Generated CSS:", css);
    
    return { html, css };
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    let errorMessage = "There was an error connecting to the AI service. Please try again later.";

    // Provide more specific error messages based on the error
    if (error instanceof Error) {
      if (error.message.includes("Invalid response format")) {
        errorMessage = "The response from the AI was not in the expected format. Please try a different prompt.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "There was a network error. Please check your internet connection.";
      } else {
        errorMessage = "An unexpected error occurred. Please try again.";
      }
    }

    toast({
      title: "API Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  }
};
