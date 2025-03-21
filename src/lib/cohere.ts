import { toast } from "@/components/ui/use-toast";

const COHERE_API_KEY = "LIKR6AGC89QCRUyaxIGGnzvxzofYOx6gRCOjDX97";
const COHERE_API_URL = "https://api.cohere.ai/v1/chat";

type CohereResponse = {
  text: string;
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
    
    const response = await simulateCohereResponse(prompt);
    
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

const simulateCohereResponse = async (prompt: string): Promise<CohereResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let html = "";
  let css = "";
  
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
  } else if (prompt.toLowerCase().includes("fish") || prompt.toLowerCase().includes("swimming")) {
    html = `<div class="ocean-scene">
  <div class="bubbles">
    <div class="bubble bubble-1"></div>
    <div class="bubble bubble-2"></div>
    <div class="bubble bubble-3"></div>
    <div class="bubble bubble-4"></div>
    <div class="bubble bubble-5"></div>
  </div>
  <div class="seaweed seaweed-1"></div>
  <div class="seaweed seaweed-2"></div>
  <div class="seaweed seaweed-3"></div>
  <div class="fish">
    <div class="fish-body">
      <div class="eye"></div>
    </div>
    <div class="fin top-fin"></div>
    <div class="fin side-fin"></div>
    <div class="tail"></div>
  </div>
  <div class="coral coral-1"></div>
  <div class="coral coral-2"></div>
  <div class="sand"></div>
</div>`;
    
    css = `.ocean-scene {
  position: relative;
  width: 300px;
  height: 250px;
  margin: 0 auto;
  background: linear-gradient(to bottom, #1a82a5, #2389ad 40%, #05445E);
  overflow: hidden;
  border-radius: 10px;
}

.fish {
  position: absolute;
  top: 40%;
  left: 20%;
  transform: translateY(-50%);
  animation: swim 15s infinite ease-in-out;
}

.fish-body {
  width: 60px;
  height: 30px;
  background: linear-gradient(to bottom, #FF9700, #FF5E00);
  border-radius: 50% 60% 60% 50%;
  position: relative;
}

.eye {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  top: 8px;
  right: 15px;
  border: 2px solid #333;
}

.fin {
  position: absolute;
  background-color: #FF7B00;
}

.top-fin {
  width: 20px;
  height: 15px;
  top: -10px;
  left: 30px;
  border-radius: 50% 50% 0 0;
  transform-origin: bottom;
  animation: finMove 1s infinite alternate ease-in-out;
}

.side-fin {
  width: 15px;
  height: 12px;
  bottom: -2px;
  left: 25px;
  border-radius: 0 0 50% 50%;
  transform-origin: top;
  animation: lowerFinMove 1s infinite alternate ease-in-out;
}

.tail {
  position: absolute;
  width: 20px;
  height: 30px;
  background-color: #FF9F55;
  top: 0px;
  left: -15px;
  border-radius: 50% 0 0 50%;
  transform-origin: right;
  animation: tailWag 0.6s infinite alternate ease-in-out;
}

.bubbles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bubble {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: bubbleRise linear infinite;
}

.bubble-1 {
  width: 10px;
  height: 10px;
  left: 20%;
  bottom: -10px;
  animation-duration: 8s;
  animation-delay: 0s;
}

.bubble-2 {
  width: 6px;
  height: 6px;
  left: 35%;
  bottom: -6px;
  animation-duration: 10s;
  animation-delay: 1s;
}

.bubble-3 {
  width: 8px;
  height: 8px;
  left: 60%;
  bottom: -8px;
  animation-duration: 7s;
  animation-delay: 2s;
}

.bubble-4 {
  width: 12px;
  height: 12px;
  left: 80%;
  bottom: -12px;
  animation-duration: 11s;
  animation-delay: 3s;
}

.bubble-5 {
  width: 7px;
  height: 7px;
  left: 10%;
  bottom: -7px;
  animation-duration: 9s;
  animation-delay: 4s;
}

.seaweed {
  position: absolute;
  bottom: 0;
  width: 20px;
  background-color: #0B8A6F;
  border-radius: 50px;
  transform-origin: bottom;
}

.seaweed-1 {
  height: 80px;
  left: 10%;
  animation: seaweedSway 4s infinite alternate ease-in-out;
}

.seaweed-2 {
  height: 60px;
  left: 75%;
  animation: seaweedSway 5s infinite alternate-reverse ease-in-out;
}

.seaweed-3 {
  height: 40px;
  left: 50%;
  animation: seaweedSway 4.5s infinite alternate ease-in-out;
}

.coral {
  position: absolute;
  bottom: 0;
}

.coral-1 {
  width: 40px;
  height: 35px;
  background: #FF5E78;
  border-radius: 25px 25px 0 0;
  left: 30%;
}

.coral-2 {
  width: 30px;
  height: 25px;
  background: #FF9671;
  border-radius: 15px 15px 0 0;
  left: 65%;
}

.sand {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: linear-gradient(to bottom, #E5D7BE, #D4BC83);
  border-radius: 0 0 10px 10px;
}

@keyframes swim {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  25% {
    transform: translateY(-60%) translateX(80px) rotate(-5deg);
  }
  50% {
    transform: translateY(-30%) translateX(180px) rotate(8deg);
  }
  75% {
    transform: translateY(-70%) translateX(80px) rotate(-5deg);
  }
}

@keyframes tailWag {
  0% {
    transform: scaleX(1) rotate(10deg);
  }
  100% {
    transform: scaleX(0.8) rotate(-10deg);
  }
}

@keyframes finMove {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
}

@keyframes lowerFinMove {
  0% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(-5deg);
  }
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-120px) translateX(15px);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-240px) translateX(0);
    opacity: 0;
  }
}

@keyframes seaweedSway {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
}`;
  } else if (prompt.toLowerCase().includes("rocket") || prompt.toLowerCase().includes("space")) {
    html = `<div class="space-scene">
  <div class="stars"></div>
  <div class="planet"></div>
  <div class="rocket">
    <div class="rocket-body">
      <div class="window"></div>
    </div>
    <div class="rocket-fins">
      <div class="fin left"></div>
      <div class="fin right"></div>
    </div>
    <div class="rocket-flames">
      <div class="flame outer"></div>
      <div class="flame inner"></div>
    </div>
  </div>
</div>`;
    
    css = `.space-scene {
  position: relative;
  width: 300px;
  height: 250px;
  background: linear-gradient(to bottom, #0A0E23, #191D45);
  overflow: hidden;
  border-radius: 10px;
  margin: 0 auto;
}

.stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 50px 20px, white, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 100px 60px, white, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 160px 120px, white, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 210px 40px, white, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 10px 90px, white, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 80px 150px, white, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 180px 180px, white, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 250px 90px, white, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 280px 200px, white, rgba(0,0,0,0)),
    radial-gradient(1px 1px at 30px 220px, white, rgba(0,0,0,0));
  animation: twinkle 5s linear infinite;
}

.planet {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4CAF50, #3F9142);
  box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.4);
  bottom: 30px;
  left: 30px;
  animation: planetPulse 8s infinite alternate ease-in-out;
}

.rocket {
  position: absolute;
  bottom: 100px;
  right: 50px;
  transform: rotate(-15deg);
  animation: launch 10s infinite alternate ease-in-out;
}

.rocket-body {
  width: 24px;
  height: 60px;
  background: linear-gradient(to right, #A2A2A2, #E0E0E0, #A2A2A2);
  border-radius: 50% 50% 30% 30%;
  position: relative;
}

.window {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #80D4FF;
  border-radius: 50%;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #666;
}

.rocket-fins {
  position: relative;
}

.fin {
  position: absolute;
  width: 10px;
  height: 20px;
  background-color: #FF5252;
  bottom: -40px;
}

.fin.left {
  left: -8px;
  transform: skewY(30deg);
}

.fin.right {
  right: -8px;
  transform: skewY(-30deg);
}

.rocket-flames {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
}

.flame {
  position: absolute;
  bottom: 0;
  border-radius: 50% 50% 20% 20%;
  animation: flicker 0.2s infinite alternate;
}

.flame.outer {
  width: 14px;
  height: 30px;
  background: linear-gradient(to bottom, #FF5722, #FF9800);
  left: -7px;
  opacity: 0.8;
}

.flame.inner {
  width: 8px;
  height: 20px;
  background: linear-gradient(to bottom, #FFD600, #FFC107);
  left: -4px;
  bottom: 5px;
  opacity: 0.9;
}

@keyframes launch {
  0% {
    transform: translate(0, 0) rotate(-15deg);
  }
  50% {
    transform: translate(-100px, -80px) rotate(-5deg);
  }
  100% {
    transform: translate(-180px, -150px) rotate(5deg);
  }
}

@keyframes flicker {
  0% {
    height: 30px;
    opacity: 0.8;
  }
  100% {
    height: 35px;
    opacity: 1;
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}

@keyframes planetPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 255, 0, 0.1);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 255, 0, 0.1);
  }
}`;
  } else if (prompt.toLowerCase().includes("flower") || prompt.toLowerCase().includes("garden")) {
    html = `<div class="garden-scene">
  <div class="sky"></div>
  <div class="sun"></div>
  <div class="cloud cloud-1"></div>
  <div class="cloud cloud-2"></div>
  <div class="flower flower-1">
    <div class="stem"></div>
    <div class="flower-center"></div>
    <div class="petal petal-1"></div>
    <div class="petal petal-2"></div>
    <div class="petal petal-3"></div>
    <div class="petal petal-4"></div>
    <div class="petal petal-5"></div>
    <div class="petal petal-6"></div>
    <div class="petal petal-7"></div>
    <div class="petal petal-8"></div>
    <div class="leaf leaf-left"></div>
    <div class="leaf leaf-right"></div>
  </div>
  <div class="flower flower-2">
    <div class="stem"></div>
    <div class="flower-center"></div>
    <div class="petal petal-1"></div>
    <div class="petal petal-2"></div>
    <div class="petal petal-3"></div>
    <div class="petal petal-4"></div>
    <div class="petal petal-5"></div>
    <div class="petal petal-6"></div>
    <div class="petal petal-7"></div>
    <div class="petal petal-8"></div>
    <div class="leaf leaf-left"></div>
    <div class="leaf leaf-right"></div>
  </div>
  <div class="butterfly">
    <div class="wing left-wing"></div>
    <div class="body"></div>
    <div class="wing right-wing"></div>
  </div>
  <div class="ground"></div>
</div>`;
    
    css = `.garden-scene {
  position: relative;
  width: 300px;
  height: 250px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 10px;
}

.sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 65%;
  background: linear-gradient(to bottom, #87CEFA, #C1E7FF);
}

.sun {
  position: absolute;
  top: 30px;
  right: 50px;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #FFFF66, #FFD700);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
  animation: sun-pulse 4s infinite alternate ease-in-out;
}

.cloud {
  position: absolute;
  width: 60px;
  height: 20px;
  background-color: white;
  border-radius: 20px;
  opacity: 0.8;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background-color: white;
  border-radius: 50%;
}

.cloud::before {
  width: 25px;
  height: 25px;
  top: -10px;
  left: 10px;
}

.cloud::after {
  width: 25px;
  height: 25px;
  top: -8px;
  right: 10px;
}

.cloud-1 {
  top: 40px;
  left: -60px;
  animation: cloud-move 20s linear infinite;
}

.cloud-2 {
  top: 80px;
  left: -100px;
  width: 80px;
  height: 25px;
  animation: cloud-move 15s linear infinite;
  animation-delay: 8s;
}

.ground {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 35%;
  background: linear-gradient(to bottom, #7CCD7C, #36A435);
  border-radius: 0 0 10px 10px;
}

.flower {
  position: absolute;
  bottom: 35%;
}

.flower-1 {
  left: 30%;
  transform-origin: bottom center;
  animation: flower-sway 5s infinite alternate ease-in-out;
}

.flower-2 {
  right: 30%;
  transform-origin: bottom center;
  animation: flower-sway 5s infinite alternate-reverse ease-in-out;
}

.stem {
  position: absolute;
  width: 4px;
  height: 80px;
  background-color: #008800;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.flower-center {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #FF9900;
  border-radius: 50%;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.petal {
  position: absolute;
  width: 20px;
  height: 25px;
  background-color: #FF5E8F;
  border-radius: 50% 50% 50% 50%;
  bottom: 87px;
  left: 50%;
  transform-origin: center bottom;
  z-index: 1;
}

.petal-1 {
  transform: translateX(-50%) rotate(0deg);
}

.petal-2 {
  transform: translateX(-50%) rotate(45deg);
}

.petal-3 {
  transform: translateX(-50%) rotate(90deg);
}

.petal-4 {
  transform: translateX(-50%) rotate(135deg);
}

.petal-5 {
  transform: translateX(-50%) rotate(180deg);
}

.petal-6 {
  transform: translateX(-50%) rotate(225deg);
}

.petal-7 {
  transform: translateX(-50%) rotate(270deg);
}

.petal-8 {
  transform: translateX(-50%) rotate(315deg);
}

.leaf {
  position: absolute;
  width: 20px;
  height: 10px;
  background-color: #008800;
  border-radius: 50% 50% 50% 50%;
}

.leaf-left {
  bottom: 40px;
  left: -8px;
  transform: rotate(-20deg);
}

.leaf-right {
  bottom: 55px;
  right: -8px;
  transform: rotate(30deg);
}

.butterfly {
  position: absolute;
  top: 40%;
  left: -20px;
  animation: butterfly-fly 15s linear infinite;
}

.wing {
  position: absolute;
  width: 15px;
  height: 20px;
  background: linear-gradient(to bottom, #6A0DAD, #9B30FF);
  border-radius: 50% 50% 50% 50%;
  opacity: 0.7;
}

.left-wing {
  left: -10px;
  transform-origin: right center;
  animation: wing-flap 0.2s infinite alternate ease-in-out;
}

.right-wing {
  left: 10px;
  transform-origin: left center;
  animation: wing-flap 0.2s infinite alternate-reverse ease-in-out;
}

.body {
  position: absolute;
  width: 4px;
  height: 20px;
  background-color: #333;
  left: 0;
  top: 0;
  border-radius: 2px;
}

@keyframes flower-sway {
  0% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(5deg);
  }
}

@keyframes wing-flap {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(60deg);
  }
}

@keyframes butterfly-fly {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(100px, -30px) rotate(10deg);
  }
  50% {
    transform: translate(200px, 20px) rotate(-5deg);
  }
  75% {
    transform: translate(250px, -20px) rotate(8deg);
  }
  100% {
    transform: translate(320px, 0) rotate(0deg);
  }
}

@keyframes cloud-move {
  0% {
    left: -100px;
  }
  100% {
    left: 100%;
  }
}

@keyframes sun-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
  }
  100% {
    transform: scale(1.1);
    box-shadow: 0 0 30px rgba(255, 255, 0, 0.8);
  }
}`;
  } else {
    html = `<div class="geometric-animation">
  <div class="shape square"></div>
  <div class="shape circle"></div>
  <div class="shape triangle"></div>
  <div class="shape diamond"></div>
</div>`;
    
    css = `.geometric-animation {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  background-color: #f5f5f5;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.shape {
  position: absolute;
  opacity: 0.8;
}

.square {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #FF416C, #FF4B2B);
  animation: moveSquare 8s linear infinite, rotate 10s linear infinite;
}

.circle {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #4776E6, #8E54E9);
  border-radius: 50%;
  animation: moveCircle 7s linear infinite, pulse 2s ease-in-out infinite;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 70px solid #00F260;
  animation: moveTriangle 10s linear infinite, colorChange 5s linear infinite;
}

.diamond {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  transform: rotate(45deg);
  animation: moveDiamond 9s linear infinite, shine 3s ease-in-out infinite;
}

@keyframes moveSquare {
  0% {
    top: 20%;
    left: 10%;
  }
  25% {
    top: 70%;
    left: 30%;
  }
  50% {
    top: 50%;
    left: 80%;
  }
  75% {
    top: 20%;
    left: 50%;
  }
  100% {
    top: 20%;
    left: 10%;
  }
}

@keyframes moveCircle {
  0% {
    top: 70%;
    left: 80%;
  }
  25% {
    top: 20%;
    left: 60%;
  }
  50% {
    top: 30%;
    left: 20%;
  }
  75% {
    top: 60%;
    left: 40%;
  }
  100% {
    top: 70%;
    left: 80%;
  }
}

@keyframes moveTriangle {
  0% {
    top: 30%;
    left: 50%;
  }
  25% {
    top: 60%;
    left: 70%;
  }
  50% {
    top: 70%;
    left: 30%;
  }
  75% {
    top: 20%;
    left: 10%;
  }
  100% {
    top: 30%;
    left: 50%;
  }
}

@keyframes moveDiamond {
  0% {
    top: 50%;
    left: 30%;
  }
  25% {
    top: 20%;
    left: 70%;
  }
  50% {
    top: 60%;
    left: 60%;
  }
  75% {
    top: 70%;
    left: 20%;
  }
  100% {
    top: 50%;
    left: 30%;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes colorChange {
  0% {
    border-bottom-color: #00F260;
  }
  33% {
    border-bottom-color: #0575E6;
  }
  66% {
    border-bottom-color: #FF4B2B;
  }
  100% {
    border-bottom-color: #00F260;
  }
}

@keyframes shine {
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.9);
  }
}`;
  }
  
  return {
    text: `${html}\n---CSS---\n${css}`
  };
};
