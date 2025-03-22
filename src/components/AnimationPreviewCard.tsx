
import React, { useRef, useEffect } from 'react';

type AnimationPreviewCardProps = {
  html: string;
  css: string;
};

const AnimationPreviewCard = ({ html, css }: AnimationPreviewCardProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (iframeRef.current && html && css) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  background: transparent;
                  overflow: hidden;
                }
                ${css}
              </style>
            </head>
            <body>
              ${html}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html, css]);

  return (
    <iframe 
      ref={iframeRef}
      className="w-full h-full border-0"
      title="Animation Preview"
    />
  );
};

export default AnimationPreviewCard;
