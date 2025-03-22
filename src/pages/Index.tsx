
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import PromptInput from '@/components/PromptInput';
import AnimationPreview from '@/components/AnimationPreview';
import { ArrowDown, Wand2, Images } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAnimation = (html: string, css: string) => {
    setHtmlCode(html);
    setCssCode(css);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    // Simulate clearing the current animation
    setHtmlCode('');
    setCssCode('');
  };

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="noise"></div>
      
      <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -top-64 -right-64 z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -bottom-32 -left-32 z-0"></div>
      
      <Header />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <section className="py-12 sm:py-20">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.42, 0, 0.58, 1] }}
          >
            <div className="flex justify-center mb-4">
              <motion.div 
                className="inline-block p-1 rounded-full bg-primary/10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Wand2 className="w-6 h-6 text-primary" />
              </motion.div>
              
              <Link to="/gallery" className="ml-4">
                <motion.div 
                  className="inline-block p-1 rounded-full bg-primary/10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <Images className="w-6 h-6 text-primary" />
                  </Button>
                </motion.div>
              </Link>
            </div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              Bring your ideas to life with&nbsp;AI
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Transform your descriptions into beautiful, looping HTML & CSS animations with the power of AI. No coding required.
            </motion.p>
            
            <motion.div 
              className="mt-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link to="/gallery">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Images className="w-4 h-4 mr-2" />
                  View Animation Gallery
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 sm:mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <ArrowDown className="w-6 h-6 text-primary animate-bounce" />
          </motion.div>
        </section>
        
        <section className="pt-4 pb-12">
          <PromptInput 
            onGenerateAnimation={handleGenerateAnimation} 
            isGenerating={isGenerating} 
            setIsGenerating={setIsGenerating} 
          />
          
          <AnimationPreview 
            html={htmlCode} 
            css={cssCode} 
            isGenerating={isGenerating}
            onRegenerate={handleRegenerate}
          />
        </section>
        
        <section id="how-it-works" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to create beautiful animations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Describe Your Vision",
                description: "Enter a detailed description of the animation you want to create.",
                icon: "✏️"
              },
              {
                title: "AI Generation",
                description: "Our AI processes your prompt and generates the HTML & CSS code.",
                icon: "✨"
              },
              {
                title: "Save & Use",
                description: "Preview your animation, save it to your gallery, or download the code to use anywhere.",
                icon: "💾"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-smooth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl mb-4 mx-auto">
                  {index + 1}
                </div>
                <h3 className="text-xl font-medium mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Animate.ai — Created with Cohere AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
