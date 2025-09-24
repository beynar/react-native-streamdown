import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { View, Text } from "react-native";
import mermaid, { MermaidConfig } from "mermaid";
import { Tokens } from "marked";
import { useStreamDown } from "../context";
import WebView from "react-native-webview";

interface MermaidProps {
  token: Tokens.Code;
}

export const Mermaid = memo<MermaidProps>(({ token }) => {
  const webviewRef = useRef<WebView>(null);
  const streamdown = useStreamDown();
  const [svg, setSvg] = useState<string | null>(null);
  const [height, setHeight] = useState<number>(0);
  const renderMermaid = async () => {
    try {
      // Sanitize the code first

      // Default configuration
      const defaultConfig: MermaidConfig = {
        theme: "base",
        startOnLoad: false,
        securityLevel: "strict",
        fontFamily: "monospace",
        suppressErrorRendering: true,

        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
        },
        ...(streamdown.mermaidConfig || {}),
      };

      // Initialize mermaid with merged config
      const mergedConfig = { ...defaultConfig };
      mermaid.initialize(mergedConfig);

      const chartHash = token.text.split("").reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
      }, 0);

      const uniqueId = `mermaid-${Math.abs(
        chartHash
      )}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // Render the diagram
      const { svg: svgString } = await mermaid.render(uniqueId, token.text);
      setSvg(svgString);
      console.log("svgString", svgString);
    } catch (err) {
      //   console.error("Error rendering mermaid", err);
      //
    }
  };

  const code = `
  graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
  `;

  useEffect(() => {
    // renderMermaid();
    webviewRef.current?.postMessage(
      JSON.stringify({ type: "code", data: token.text })
    );
  }, [token.text]);

  //   if (!svg) {
  //     return <View style={streamdown.theme.mermaid.base} />;
  //   }
  const webview = useMemo(() => {
    console.log("webview");
    return (
      <WebView
        ref={webviewRef}
        automaticallyAdjustContentInsets={false}
        scrollEnabled={false}
        originWhitelist={["*"]}
        onMessage={(e) => {
          const { type, data } = JSON.parse(e.nativeEvent.data);
          console.log("webview message", type, data);
          if (type === "height") {
            console.log("height", data);
            setHeight(Number(data.finalHeight));
          }
          if (type === "requestCode") {
            webviewRef.current?.postMessage(
              JSON.stringify({ type: "code", data: token.text })
            );
          }
          if (type === "error") {
            console.log("error", data);
          }
          if (type === "received") {
            console.log("received", data);
          }
        }}
        source={{
          html: /*js*/ `
<!DOCTYPE html>
<html style="width: 100vw; height: 100vh; margin: 0; padding: 0; box-sizing: border-box;">
<head>
<style>
  #mermaidcontainer {
    width: 100vw;                 
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;    
  }
  
  #mermaidcontainer svg {      
        
  }
</style>
</head>
<body style="width: 100vw; height: 100vh; margin: 0; padding: 0; box-sizing: border-box;">

<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'; 
mermaid.initialize({ 
  startOnLoad: false,  
  suppressErrorRendering: true, 
  theme: "base", 
  securityLevel: "strict", 
  fontFamily: "monospace", 
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis",
  } 
});

window.ReactNativeWebView.postMessage(JSON.stringify({type: "requestCode", data: "mount"}));

window.addEventListener("message", async (e) => {
  const {type, data} = JSON.parse(e.data);    

  if(type === "code"){
    try{  
      let element = window.document.getElementById("mermaidcontainer");
      const prevSvg = element?.querySelector("svg")?.innerHTML||"";
      if(!element){
        window.ReactNativeWebView.postMessage(JSON.stringify({type: "error", data: "Element not found"}));
        return;
      }

      if (!(await mermaid.parse(data))) {
        return
      }
      const { svg } = await mermaid.render("mermaid-diagram", data); 
      if(!svg){
        return;
      }
      element.innerHTML = svg; 
      
      // Wait for SVG to render before getting height
      setTimeout(() => {
        // Get the container's actual height after SVG is inserted
        const containerHeight = element.clientHeight;
        const svg = element.querySelector("svg");
        const viewBox = svg?.getAttribute("viewBox");   
        const height = viewBox?.split(" ")[3]
        
        // Use the larger of the two heights to ensure proper display
        const finalHeight = Math.min(containerHeight, Number(height))/2;
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "height",          
          data: { containerHeight, height, finalHeight, viewBox }
        }));
      }, 100);
    } catch (err) {
        element.innerHTML = prevSvg;
        
    //   
    }
  }
});
</script>

<div id="mermaidcontainer">

</div>

</body>
</html>
      `,
        }}
      />
    );
  }, []);
  return (
    <View style={[streamdown.theme.mermaid.base, { height }]}>{webview}</View>
  );
});

export default Mermaid;
