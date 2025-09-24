import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { View, Text } from "react-native";
import { useStreamDown } from "../context";
import type { MathToken } from "../marked/marked-math";
import WebView from "react-native-webview";

interface MathProps {
  token: MathToken;
}

export const Math = memo<MathProps>(({ token }) => {
  const webviewRef = useRef<WebView>(null);
  const streamdown = useStreamDown();
  const [height, setHeight] = useState<number>(token.isInline ? 30 : 100);
  const [isKaTeXReady, setIsKaTeXReady] = useState(false);
  const content = token.text;

  useEffect(() => {
    if (isKaTeXReady) {
      webviewRef.current?.postMessage(
        JSON.stringify({
          type: "math",
          data: content,
          isInline: token.isInline,
        })
      );
    }
  }, [content, token.isInline, isKaTeXReady]);

  const webview = useMemo(
    () => (
      <WebView
        ref={webviewRef}
        automaticallyAdjustContentInsets={false}
        scrollEnabled={false}
        originWhitelist={["*"]}
        onMessage={(e) => {
          const { type, data } = JSON.parse(e.nativeEvent.data);
          if (type === "ready") {
            console.log("KaTeX ready:", data);
            setIsKaTeXReady(true);
          }
          if (type === "height") {
            console.log("Math height data:", data);
            const newHeight = Number(data.finalHeight) || 80;
            setHeight(newHeight);
          }
          if (type === "error") {
            console.log("KaTeX error", data);
          }
        }}
        source={{
          html: `
<!DOCTYPE html>
<html style="width: 100vw; height: 100vh; margin: 0; padding: 0; box-sizing: border-box;">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <style>
    body {
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
     #math-container {      
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow-x: auto;
      overflow-y: hidden;
    }
    
    .inline-container {
      padding: 4px 8px;
      background-color: #f3f4f6;
      border-radius: 4px;
      display: inline-block;
      white-space: nowrap;
    }

   
    .block-container {     
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;    
      width: max-content;
      min-width: calc(100% );
      display: flex;
      align-items: center;
      justify-content: center; 
      flex-shrink: 0;
    }
    
    .katex {
      font-size: 1.8em !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .katex-display {
      margin: 0 !important;
      padding: 0 !important;
      font-size: 2.2em !important;
      line-height: 1 !important;
      white-space: nowrap;
      overflow-x: visible;
    }
    
    .katex-display > .katex {
      margin: 0 !important;
      padding: 0 !important;
      white-space: nowrap;
    }
    
    .katex .base {
      margin: 0 !important;
      padding: 0 !important;
      white-space: nowrap;
    }
  </style>
</head>
<body>
<div id="math-container"></div>

<script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
<script>
// Wait for KaTeX to be loaded before setting up message listener
function waitForKaTeX() {
  if (typeof katex !== 'undefined') {
    setupMathRenderer();
  } else {
    setTimeout(waitForKaTeX, 50);
  }
}

function setupMathRenderer() {
  // Signal that we're ready
  window.ReactNativeWebView.postMessage(JSON.stringify({type: "ready", data: "KaTeX loaded"}));
  
  window.addEventListener("message", async (e) => {
    const {type, data, isInline} = JSON.parse(e.data);
    
    if(type === "math"){
      try {
        const element = document.getElementById("math-container");
        if(!element) return;
        
        // Set appropriate container class based on inline/block
        element.className = isInline ? "inline-container" : "block-container";
        
        katex.render(data, element, {
          throwOnError: true,
          displayMode: !isInline
        });
        
        // Check if content needs scrolling and adjust alignment
        setTimeout(() => {
          const containerWidth = element.clientWidth;
          const contentWidth = element.scrollWidth;
          
          if (contentWidth > containerWidth) {
            // Content overflows, keep left alignment for scrolling
            element.style.justifyContent = 'flex-start';
          } else {
            // Content fits, center it
            element.style.justifyContent = 'center';
          }
        }, 50);
        
        // Calculate height after rendering
        setTimeout(() => {
          if (isInline) {
            // For inline math, use fixed height
            const finalHeight = 30;
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "height",
              data: { finalHeight }
            }));
          } else {
            // For block math, calculate height based on the actual KaTeX element
          const katexElement = element.querySelector('.katex-display') || element.querySelector('.katex');
          const katexHeight = katexElement ? katexElement.clientHeight : 50;          
            const finalHeight = katexHeight;
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "height",
              data: { katexHeight, finalHeight: finalHeight / 2 }
            }));
          }
        }, 100);
      } catch (err) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "error", 
          data: err.message
        }));
      }
    }
  });
}

// Start waiting for KaTeX to load
waitForKaTeX();
</script>
</body>
</html>
        `,
        }}
      />
    ),
    []
  );

  const containerStyle = token.isInline
    ? [streamdown.theme.math.inline, { height: 30 }]
    : [
        streamdown.theme.math.block,
        {
          height: height || 80,
          minHeight: 60,
        },
      ];

  return <View style={containerStyle}>{webview}</View>;
});

export default Math;
