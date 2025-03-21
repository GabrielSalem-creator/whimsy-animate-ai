
import { toast } from "@/components/ui/use-toast";

const COHERE_API_KEY = "LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97";
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

type CohereResponse = {
  text: string;
};

export const generateAnimation = async (prompt: string): Promise<{ html: string, css: string }> => {
  try {
    const systemPrompt = `You are an expert HTML/CSS animation creator. Your task is to convert user prompts into detailed, working HTML and CSS animations. Follow these rules:

1. Create ONLY HTML and CSS animations (no JavaScript).
2. Make the animation loop infinitely.
3. Use clean, modern CSS with keyframes for animations.
4. Ensure all animations are centered and responsive.
5. Optimize for performance using transform and opacity.
6. Keep the code clean and well-commented.
7. Return ONLY the raw HTML and CSS code, separated by a divider like "---CSS---".

For example, if asked for "a bouncing ball", return:
<div class="ball"></div>
---CSS---
.ball {
  width: 50px;
  height: 50px;
  background-color: red;
  border-radius: 50%;
  animation: bounce 1s infinite alternate;
}
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-100px); }
}`;

    const userMessage = `${prompt}. Make it a clean, looping animation using only HTML and CSS. Return just the HTML and CSS code separated by ---CSS---.`;

    console.log("Sending request to Cohere...");
    
    // For now, we'll simulate the Cohere API response with a mock
    // In a real implementation, this would be an actual API call
    const response = await simulateCohereResponse(prompt);
    
    // Parse the response to separate HTML and CSS
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

// This function simulates a response from the Cohere API
// In a real implementation, this would be replaced with an actual API call
const simulateCohereResponse = async (prompt: string): Promise<CohereResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let html = "";
  let css = "";
  
  // Generate different animations based on the prompt
  if (prompt.toLowerCase().includes("cat")) {
    html = `<div class="scene">
  <div class="cat">
    <div class="head">
      <div class="ear left"></div>
      <div class="ear right"></div>
      <div class="face">
        <div class="eye left"></div>
        <div class="eye right"></div>
        <div class="nose"></div>
        <div class="mouth"></div>
      </div>
    </div>
    <div class="body">
      <div class="tail"></div>
      <div class="paw front-left"></div>
      <div class="paw front-right"></div>
      <div class="paw back-left"></div>
      <div class="paw back-right"></div>
    </div>
  </div>
  <div class="fence"></div>
  <div class="ground"></div>
</div>`;
    
    css = `.scene {
  position: relative;
  width: 300px;
  height: 200px;
  margin: 0 auto;
}

.cat {
  position: absolute;
  bottom: 40px;
  left: 50px;
  animation: jump 2s infinite;
}

.head {
  width: 50px;
  height: 45px;
  background-color: #f0c07a;
  border-radius: 50% 50% 45% 45%;
  position: relative;
}

.ear {
  width: 15px;
  height: 20px;
  background-color: #f0c07a;
  border-radius: 50% 50% 0 0;
  position: absolute;
  top: -10px;
}

.ear.left {
  left: 5px;
  transform: rotate(-15deg);
}

.ear.right {
  right: 5px;
  transform: rotate(15deg);
}

.face {
  position: relative;
  top: 15px;
}

.eye {
  width: 8px;
  height: 8px;
  background-color: #333;
  border-radius: 50%;
  position: absolute;
  top: 0;
  animation: blink 3s infinite;
}

.eye.left {
  left: 12px;
}

.eye.right {
  right: 12px;
}

.nose {
  width: 6px;
  height: 3px;
  background-color: #ff9d9d;
  border-radius: 50%;
  position: absolute;
  top: 12px;
  left: 22px;
}

.mouth {
  width: 10px;
  height: 3px;
  border-bottom: 2px solid #333;
  border-radius: 50%;
  position: absolute;
  top: 18px;
  left: 20px;
}

.body {
  width: 60px;
  height: 35px;
  background-color: #f0c07a;
  border-radius: 50% 40% 40% 50%;
  position: relative;
  top: -5px;
}

.tail {
  width: 8px;
  height: 40px;
  background-color: #f0c07a;
  position: absolute;
  right: -5px;
  bottom: 15px;
  border-radius: 0 0 50% 50%;
  transform-origin: top;
  animation: tailWag 0.5s infinite alternate;
}

.paw {
  width: 10px;
  height: 20px;
  background-color: #f0c07a;
  position: absolute;
  border-radius: 0 0 5px 5px;
}

.paw.front-left {
  left: 10px;
  bottom: -15px;
  animation: frontPawLeft 2s infinite;
}

.paw.front-right {
  left: 25px;
  bottom: -15px;
  animation: frontPawRight 2s infinite;
}

.paw.back-left {
  right: 10px;
  bottom: -15px;
  animation: backPawLeft 2s infinite;
}

.paw.back-right {
  right: -5px;
  bottom: -15px;
  animation: backPawRight 2s infinite;
}

.fence {
  width: 200px;
  height: 40px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to bottom, #a67c52 0%, #a67c52 20%, transparent 20%, transparent 40%, #a67c52 40%, #a67c52 60%, transparent 60%, transparent 80%, #a67c52 80%, #a67c52 100%);
}

.ground {
  width: 100%;
  height: 10px;
  background-color: #8fc17a;
  position: absolute;
  bottom: 0;
}

@keyframes jump {
  0%, 100% {
    transform: translateY(0) scaleY(1);
  }
  10% {
    transform: translateY(0) scaleY(0.9);
  }
  40% {
    transform: translateY(-60px) scaleY(1.1);
  }
  70% {
    transform: translateY(0) scaleY(0.95);
  }
  80% {
    transform: translateY(-10px) scaleY(1);
  }
  90% {
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 95%, 100% {
    transform: scaleY(1);
  }
  97.5% {
    transform: scaleY(0);
  }
}

@keyframes tailWag {
  0% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(15deg);
  }
}

@keyframes frontPawLeft {
  0%, 15%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px) rotate(-20deg);
  }
}

@keyframes frontPawRight {
  0%, 20%, 85%, 100% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(-15px) rotate(-20deg);
  }
}

@keyframes backPawLeft {
  0%, 15%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
}

@keyframes backPawRight {
  0%, 20%, 85%, 100% {
    transform: translateY(0);
  }
  45% {
    transform: translateY(-10px);
  }
}`;
  } else if (prompt.toLowerCase().includes("bird") || prompt.toLowerCase().includes("flying")) {
    html = `<div class="sky">
  <div class="cloud cloud-1"></div>
  <div class="cloud cloud-2"></div>
  <div class="cloud cloud-3"></div>
  <div class="bird">
    <div class="wing left"></div>
    <div class="body"></div>
    <div class="wing right"></div>
    <div class="head">
      <div class="eye"></div>
      <div class="beak"></div>
    </div>
  </div>
</div>`;
    
    css = `.sky {
  position: relative;
  width: 300px;
  height: 200px;
  background: linear-gradient(to bottom, #87CEEB, #B0E0E6);
  overflow: hidden;
  border-radius: 10px;
}

.cloud {
  position: absolute;
  background-color: white;
  border-radius: 50%;
  opacity: 0.8;
}

.cloud-1 {
  width: 60px;
  height: 20px;
  top: 30px;
  left: -60px;
  animation: moveClouds 20s linear infinite;
}

.cloud-2 {
  width: 80px;
  height: 25px;
  top: 70px;
  left: -80px;
  animation: moveClouds 15s linear infinite;
  animation-delay: 5s;
}

.cloud-3 {
  width: 50px;
  height: 18px;
  top: 100px;
  left: -50px;
  animation: moveClouds 25s linear infinite;
  animation-delay: 10s;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background-color: white;
  border-radius: 50%;
}

.cloud::before {
  width: 40%;
  height: 100%;
  top: -50%;
  left: 20%;
}

.cloud::after {
  width: 40%;
  height: 100%;
  top: -40%;
  right: 20%;
}

.bird {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: fly 10s infinite alternate;
}

.body {
  width: 40px;
  height: 25px;
  background-color: #E63946;
  border-radius: 50% 50% 40% 40%;
  position: relative;
}

.head {
  width: 25px;
  height: 25px;
  background-color: #E63946;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  left: 30px;
}

.eye {
  width: 6px;
  height: 6px;
  background-color: black;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  right: 5px;
}

.beak {
  width: 15px;
  height: 8px;
  background-color: #FF9900;
  position: absolute;
  top: 12px;
  right: -14px;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}

.wing {
  width: 30px;
  height: 20px;
  background-color: #E63946;
  position: absolute;
  border-radius: 50% 50% 0 50%;
}

.wing.left {
  top: 0;
  left: -5px;
  transform-origin: right top;
  animation: flapLeft 0.5s infinite alternate;
}

.wing.right {
  top: 0;
  left: 15px;
  transform-origin: left top;
  animation: flapRight 0.5s infinite alternate;
}

@keyframes flapLeft {
  0% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(-40deg);
  }
}

@keyframes flapRight {
  0% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(40deg);
  }
}

@keyframes fly {
  0% {
    transform: translate(-50%, -30%) rotate(5deg);
  }
  25% {
    transform: translate(-30%, -50%) rotate(-2deg);
  }
  50% {
    transform: translate(-50%, -70%) rotate(0deg);
  }
  75% {
    transform: translate(-70%, -50%) rotate(2deg);
  }
  100% {
    transform: translate(-50%, -30%) rotate(5deg);
  }
}

@keyframes moveClouds {
  0% {
    left: -80px;
  }
  100% {
    left: 100%;
  }
}`;
  } else {
    // Default animation for other prompts
    html = `<div class="container">
  <div class="object"></div>
  <div class="shadow"></div>
</div>`;
    
    css = `.container {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.object {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border-radius: 8px;
  animation: float 2s ease-in-out infinite;
}

.shadow {
  position: absolute;
  bottom: 20px;
  width: 40px;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(3px);
  animation: shadow 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

@keyframes shadow {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.7);
  }
}`;
  }
  
  return {
    text: `${html}\n---CSS---\n${css}`
  };
};
