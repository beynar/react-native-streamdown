import React, { memo, useMemo, useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { lex, parseBlocks, StreamdownToken } from "./marked";
import {
  Snippets,
  useStreamDown,
  StreamDownContext,
  StreamDownContextValue,
  StreamDownTheme,
  FootNotes,
  FootNotesContext,
} from "./context";
import { theme as defaultTheme } from "./theme";
import Element from "./Elements/Element";
import { AnimatedBlock, AnimatedText } from "./Elements/Animateds";
import { parseIncompleteMarkdown } from "./utils/parse-incomplete-markdown";

// Export streaming utilities for advanced use cases
export { useStreamingStats } from "./utils/streaming";
export type { StreamingStats } from "./utils/streaming";

interface StreamDownProps {
  children: string;
  snippets?: Snippets;
  allowedImagePrefixes?: string[];
  allowedLinkPrefixes?: string[];
  defaultOrigin?: string;
  renderHtml?: boolean | ((token: any) => string);
  theme?: StreamDownTheme;
  // Future: streaming animations (placeholder for now)
  enableStreamingAnimations?: boolean;
}

export const StreamDown: React.FC<StreamDownProps> = ({
  children,
  snippets,
  allowedImagePrefixes,
  allowedLinkPrefixes,
  theme,
  defaultOrigin,
  renderHtml,
  enableStreamingAnimations,
}) => {
  // Create StreamdownContext instance for footnote management
  const streamdownContext = useMemo(() => {
    return {
      enableStreamingAnimations: enableStreamingAnimations ?? true,
      theme: theme ?? defaultTheme,
      snippets: snippets ?? {},
      allowedImagePrefixes: allowedImagePrefixes ?? ["*"],
      allowedLinkPrefixes: allowedLinkPrefixes ?? ["*"],
      defaultOrigin: defaultOrigin ?? "",
      renderHtml: renderHtml ?? false,
    };
  }, [
    enableStreamingAnimations,
    allowedImagePrefixes,
    allowedLinkPrefixes,
    defaultOrigin,
    renderHtml,
    theme,
  ]);

  const footNotes = useMemo(() => {
    return new FootNotes();
  }, []);

  // Optimized block parsing with caching
  const blocks = useMemo(() => parseBlocks(children, footNotes), [children]);

  return (
    <StreamDownContext.Provider value={streamdownContext}>
      <FootNotesContext.Provider value={footNotes}>
        <View style={{ flex: 1, maxWidth: "100%" }}>
          {blocks.map((block, index) => {
            return <Block footNotes={footNotes} key={index} block={block} />;
          })}
        </View>
      </FootNotesContext.Provider>
    </StreamDownContext.Provider>
  );
};

export const Block = memo<{
  block: string;
  footNotes?: FootNotes;
}>(
  ({ block, footNotes }) => {
    const tokens = useMemo(() => {
      return lex(parseIncompleteMarkdown(block?.trim?.() || ""), footNotes);
    }, [block]);

    return <Tokens tokens={tokens} />;
  },
  (prevProps, nextProps) => prevProps.block === nextProps.block
);

interface TokensProps {
  tokens: StreamdownToken[];
}

const Tokens = ({ tokens }: TokensProps) => {
  return tokens.map((token, index) => {
    const childrenTokens = (token as any).tokens || [];
    const isTextOnlyToken = childrenTokens.length === 0;
    return (
      <Element key={`token-${index}`} token={token}>
        {isTextOnlyToken ? (
          "text" in token ? (
            token.text
          ) : (
            ""
          )
        ) : (
          <Tokens tokens={childrenTokens} />
        )}
      </Element>
    );
  });
};
