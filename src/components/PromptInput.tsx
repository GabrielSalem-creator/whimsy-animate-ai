
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { generateAnimation } from '@/lib/cohere';

type PromptInputProps = {
  onGenerateAnimation: (html: string, css: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
};

const PromptInput = ({ onGenerateAnimation, isGenerating, setIsGenerating }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the animation you want to create",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const { html, css } = await generateAnimation(prompt);
      onGenerateAnimation(html, css);
      toast({
        title: "Animation created!",
        description: "Your animation has been generated successfully",
      });
    } catch (error) {
      console.error("Error generating animation:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your animation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.42, 0, 0.58, 1] }}
    >
      <div className="bg-white rounded-2xl p-1 shadow-smooth">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Describe your animation... (e.g., 'A cat jumping over a fence')"
              className="min-h-[120px] p-4 rounded-xl border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 resize-none text-base transition-all duration-200 bg-secondary/50 placeholder:text-muted-foreground/70"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
            
            <motion.div 
              className="absolute top-3 left-3 bg-primary/10 text-primary/80 text-xs font-medium px-2 py-1 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              AI-Powered
            </motion.div>
          </div>
          
          <div className="flex justify-end px-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                type="submit" 
                className="rounded-xl px-6 py-6 h-auto bg-primary hover:bg-primary/90 text-white font-medium flex items-center space-x-2 transition-all duration-300"
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Animation</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
      
      <div className="mt-3 text-xs text-center text-muted-foreground">
        <p>Animations are generated using the Cohere AI model and might take a few seconds.</p>
      </div>
    </motion.div>
  );
};

export default PromptInput;
