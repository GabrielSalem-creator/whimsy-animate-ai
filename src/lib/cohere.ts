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

export interface AnimationData {
  id: string;
  title: string;
  prompt: string;
  html: string;
  css: string;
  createdAt: number;
}

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
    
    const systemPrompt = `You are an expert HTML/CSS animation creator specializing in creating ONLY the requested object with extreme precision and detail. Your task is to convert user prompts into flawlessly working HTML and CSS animations following these strict guidelines:

1. FOCUS EXCLUSIVELY ON THE REQUESTED OBJECT:
   - Create ONLY what the user explicitly requests - nothing more
   - Do not add backgrounds, environments, or any elements not specified in the prompt
   - Triple-check your code to ensure it works perfectly with no errors

2. CREATE ULTRA-DETAILED OBJECTS WITH ANATOMICALLY CORRECT PROPORTIONS:
   - Avoid using only basic rectangles and squares - use border-radius extensively for smooth corners
   - Use clip-path, border-radius, and curved SVG paths to create organic, flowing shapes
   - CRITICAL: Maintain proper proportions between all parts of the object (e.g., head-to-body ratio for animals)
   - Use reference anatomy when creating animals or characters - ensure body parts are correctly sized and positioned
   - Break down objects into dozens of tiny, precisely positioned sub-components
   - Use exact positioning with precise coordinates (px, %, em) for every element
   - Create perfect layering with z-index to give the object depth and dimension

3. PERFECT POSITION AND MOVEMENT:
   - Position each element with pixel-perfect precision in relation to other elements
   - CRITICAL: All parts must maintain proper relative positions during animations - prevent parts from separating
   - Use container elements to group related parts that should move together
   - Ensure all sub-components move in harmony with proper timing offsets
   - Use translate3d and transform-origin for smoother movements with precise pivot points
   - Create micro-animations for each sub-element (subtle movements, pulses, color shifts)
   - Implement timing functions that feel natural and fluid
   - Ensure proper perspective and scale for 3D-like effects when appropriate

4. COLORS AND VISUAL DETAIL:
   - Use rich color palettes with gradients, not just flat colors
   - Implement subtle shadows and highlights to create depth and volume
   - Use opacity variations and blend modes for more realistic effects
   - Implement fine details like texture, grain, or patterns where appropriate
   - Use HSLA or RGBA colors to allow for transparency effects

5. AVOID COMMON SCALING ERRORS:
   - DO NOT make animal limbs too long or thin
   - DO NOT distort proportions during animations
   - DO NOT separate connected parts during movement
   - ALWAYS maintain proper anatomical structure during all animation phases
   - ALWAYS test your animations through multiple cycles to ensure they remain stable

6. USE ONLY PURE HTML AND CSS:
   - No JavaScript allowed
   - All animations must loop infinitely using CSS animations and keyframes
   - Use modern CSS techniques: transforms, perspective, clip-path, etc.
   - Optimize performance with will-change, transform, and opacity properties

7. Return ONLY the raw HTML and CSS code, separated by "---CSS---".
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
- Use SMOOTH, ORGANIC SHAPES with curved edges and flowing forms - avoid basic rectangles and squares
- CRITICAL: Maintain anatomically correct proportions and structure (especially for animals or characters)
- Create perfect positioning with each element precisely placed in relation to others
- Break the object into dozens of small, precisely positioned elements
- Group related elements that should move together using container divs
- Use advanced CSS techniques like clip-path, SVG paths and border-radius for natural, flowing shapes
- Add detailed visual elements: shadows, highlights, gradients, subtle textures
- Create natural movement with bezier curve easing and proper timing
- Add micro-animations to every element for incredible realism
- Implement depth with careful z-indexing and shadows
- AVOID COMMON ERRORS: Do not make limbs too long, do not separate parts during animation
- Ensure all animations loop perfectly with appropriate easing functions
- Triple-check your code to ensure it works flawlessly with no errors
- Return just the HTML and CSS code separated by ---CSS---

Remember to be extremely precise with all measurements and positions to create a truly exceptional animation of ONLY the requested object, with smooth organic shapes, anatomically correct proportions, and perfect movement.
this is an example of a flower 
When You Generate Concentrate on Each detail And also have a general and detailed vision to take in consideration the visual aspect of it and the proportions and the layout repeat process many time until finding best result
<div class="garden-scene">
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
</div>

.garden-scene {
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
