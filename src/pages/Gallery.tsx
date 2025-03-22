
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSavedAnimations, deleteAnimation, AnimationData } from '@/lib/cohere';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Eye, Download } from 'lucide-react';
import AnimationPreviewCard from '@/components/AnimationPreviewCard';
import { toast } from 'sonner';

const Gallery = () => {
  const [animations, setAnimations] = useState<AnimationData[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationData | null>(null);

  // Load saved animations
  useEffect(() => {
    const loadAnimations = () => {
      const saved = getSavedAnimations();
      setAnimations(saved);
    };

    loadAnimations();
    // Set up event listener for storage changes
    window.addEventListener('storage', loadAnimations);
    
    return () => {
      window.removeEventListener('storage', loadAnimations);
    };
  }, []);

  const handleDelete = (id: string) => {
    deleteAnimation(id);
    setAnimations(animations.filter(anim => anim.id !== id));
    
    if (selectedAnimation && selectedAnimation.id === id) {
      setSelectedAnimation(null);
    }
    
    toast.success('Animation deleted successfully');
  };

  const handleDownload = (animation: AnimationData) => {
    // Create combined HTML file with embedded CSS
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${animation.title || 'AI Generated Animation'}</title>
  <style>
${animation.css}
  </style>
</head>
<body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;">
${animation.html}
</body>
</html>`;

    // Create a blob and download link
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animation.title || 'animation'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Animation downloaded successfully');
  };

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="noise"></div>
      
      <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -top-64 -right-64 z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl -bottom-32 -left-32 z-0"></div>
      
      <Header />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/" className="mr-4">
            <Button variant="outline" size="sm" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Animation Gallery</h1>
        </div>
        
        {animations.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-smooth max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-medium mb-3">No saved animations yet</h2>
              <p className="text-muted-foreground mb-6">
                Go back to the home page to create your first animation!
              </p>
              <Link to="/">
                <Button>Create Animation</Button>
              </Link>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-medium mb-4">Saved Animations</h2>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {animations.map((animation) => (
                  <motion.div 
                    key={animation.id}
                    className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all duration-200 ${selectedAnimation?.id === animation.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedAnimation(animation)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium truncate">
                        {animation.title || `Animation ${animation.id.substring(0, 6)}`}
                      </h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(animation.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {animation.prompt.substring(0, 100)}
                      {animation.prompt.length > 100 ? '...' : ''}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {new Date(animation.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {selectedAnimation ? (
                <motion.div
                  className="bg-white rounded-2xl shadow-smooth p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-medium">
                      {selectedAnimation.title || `Animation ${selectedAnimation.id.substring(0, 6)}`}
                    </h2>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(selectedAnimation)}
                        className="flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-secondary/30 rounded-lg overflow-hidden mb-6">
                    <AnimationPreviewCard html={selectedAnimation.html} css={selectedAnimation.css} />
                  </div>
                  
                  <Tabs defaultValue="prompt" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="prompt">Prompt</TabsTrigger>
                      <TabsTrigger value="code">Code</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="prompt" className="rounded-lg bg-secondary/30 p-4">
                      <p className="whitespace-pre-wrap text-sm">{selectedAnimation.prompt}</p>
                    </TabsContent>
                    
                    <TabsContent value="code">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg bg-secondary/30 p-4 overflow-auto max-h-[300px]">
                          <h4 className="text-sm font-medium mb-2">HTML</h4>
                          <pre className="text-xs whitespace-pre-wrap">{selectedAnimation.html}</pre>
                        </div>
                        <div className="rounded-lg bg-secondary/30 p-4 overflow-auto max-h-[300px]">
                          <h4 className="text-sm font-medium mb-2">CSS</h4>
                          <pre className="text-xs whitespace-pre-wrap">{selectedAnimation.css}</pre>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center bg-white rounded-2xl shadow-smooth p-6">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Select an animation to preview</h3>
                    <p className="text-muted-foreground mt-2">
                      Click on an animation from the list to view it in detail
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
