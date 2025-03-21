import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnimationPreviewProps = {
  html: string;
  css: string;
  isGenerating: boolean;
  onRegenerate: () => void;
};

const AnimationPreview = ({ html, css, isGenerating, onRegenerate }: AnimationPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (iframeRef.current && html && css) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:transparent;">
              ${html}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css]);

  const handleDownload = () => {
    const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Generated Animation</title>
  <style>
${css}
  </style>
</head>
<body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;">
${html}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animation.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!html && !css && !isGenerating) {
    return null;
  }

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
    >
      {(html && css) ? (
        <>
          <div className="bg-white rounded-2xl p-6 shadow-smooth">
            <h3 className="text-xl font-medium mb-4">Your Animation</h3>
            
            <div className="aspect-video bg-secondary/30 rounded-lg overflow-hidden mb-6">
              <iframe 
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Animation Preview"
              />
            </div>
            
            <Tabs defaultValue="preview" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRegenerate}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    <span>Regenerate</span>
                  </Button>
                  
                  <Button 
                    onClick={handleDownload}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
              
              <TabsContent value="preview" className="mt-0">
                <div className="flex justify-center items-center p-4">
                  <p className="text-sm text-muted-foreground text -center">
                    Your animation is displayed above. Download it or view the code.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="code" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary/30 p-4 overflow-auto max-h-[300px]">
                    <div className="flex items-center mb-2">
                      <Code className="w-4 h-4 mr-2 text-muted-foreground" />
                      <h4 className="text-sm font-medium">HTML</h4>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap">{html}</pre>
                  </div>
                  
                  <div className="rounded-lg bg-secondary/30 p-4 overflow-auto max-h-[300px]">
                    <div className="flex items-center mb-2">
                      <Code className="w-4 h-4 mr-2 text-muted-foreground" />
                      <h4 className="text-sm font-medium">CSS</h4>
                    </div>
                    <pre className="text-xs whitespace-pre-wrap">{css}</pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-medium">Generating your animation...</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few moments as our AI crafts your animation
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AnimationPreview;