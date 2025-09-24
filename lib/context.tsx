import React, { createContext, memo, useContext } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Tokens } from "marked";
import { ListItemToken, ListToken } from "./marked/marked-list";
import {
  TableToken,
  TBody,
  TD,
  TFoot,
  TH,
  THead,
  THeadRow,
  TRow,
} from "./marked/marked-table";
import { MathToken } from "./marked/marked-math";
import { FootnoteRef, FootnoteToken } from "./marked/marked-footnotes";
import { AlertToken } from "./marked/marked-alert";
import { SubSupToken } from "./marked/marked-subsup";
import { MermaidConfig } from "mermaid";

type TokenSnippet = {
  heading: Tokens.Heading;
  paragraph: Tokens.Paragraph;
  blockquote: Tokens.Blockquote;
  code: Tokens.Code;
  codespan: Tokens.Codespan;
  ul: ListToken;
  ol: ListToken;
  li: ListItemToken;
  table: TableToken;
  thead: THead;
  tbody: TBody;
  tfoot: TFoot;
  tr: THeadRow | TRow;
  td: TD;
  th: TH;
  image: Tokens.Image;
  link: Tokens.Link;
  strong: Tokens.Strong;
  em: Tokens.Em;
  del: Tokens.Del;
  hr: Tokens.Hr;
  br: Tokens.Br;
  math: MathToken;
  alert: AlertToken;
  mermaid: Tokens.Code;
  footnoteRef: FootnoteRef;
  footnotePopover: FootnoteToken;
  sup: SubSupToken;
  sub: SubSupToken;
};

type PredefinedElements = keyof TokenSnippet;

export type Snippets = {
  [K in PredefinedElements]?: React.ComponentType<{
    children: React.ReactNode;
    token: TokenSnippet[K];
  }>;
};

export interface StreamDownTheme {
  link: {
    base: TextStyle;
    blocked: TextStyle;
  };
  h1: { base: TextStyle };
  h2: { base: TextStyle };
  h3: { base: TextStyle };
  h4: { base: TextStyle };
  h5: { base: TextStyle };
  h6: { base: TextStyle };
  paragraph: { base: TextStyle };
  ul: { base: ViewStyle };
  ol: { base: ViewStyle };
  li: {
    base: ViewStyle;
    checkbox: ViewStyle;
  };
  codespan: { base: TextStyle };
  image: {
    base: ViewStyle;
    image: ViewStyle;
  };
  blockquote: { base: ViewStyle };
  alert: {
    base: ViewStyle;
    title: TextStyle;
    icon: ViewStyle;
    note: ViewStyle;
    tip: ViewStyle;
    warning: ViewStyle;
    caution: ViewStyle;
    important: ViewStyle;
  };
  table: {
    base: ViewStyle;
    table: ViewStyle;
  };
  thead: { base: ViewStyle };
  tbody: { base: ViewStyle };
  tfoot: { base: ViewStyle };
  tr: { base: ViewStyle };
  td: { base: TextStyle };
  th: { base: TextStyle };
  sup: { base: TextStyle };
  sub: { base: TextStyle };
  hr: { base: ViewStyle };
  strong: { base: TextStyle };
  math: {
    block: ViewStyle;
    inline: ViewStyle;
  };
  br: { base: ViewStyle };
  em: { base: TextStyle };
  del: { base: TextStyle };
  footnoteRef: { base: TextStyle };
  footnotePopover: { base: ViewStyle };
  mermaid: { base: ViewStyle };
}

export interface StreamDownContextValue {
  theme: StreamDownTheme;
  snippets: Snippets;
  allowedImagePrefixes?: string[];
  allowedLinkPrefixes?: string[];
  defaultOrigin?: string;
  renderHtml?: boolean | ((token: any) => string);
  enableStreamingAnimations?: boolean;
  mermaidConfig?: MermaidConfig;
}

export const StreamDownContext = createContext<StreamDownContextValue | null>(
  null
);

export const useStreamDown = (): StreamDownContextValue => {
  const context = useContext(StreamDownContext);
  if (!context) {
    throw new Error("useStreamDown must be used within a StreamDownProvider");
  }
  return context;
};

export class FootNotes {
  footnotes = {
    refs: new Map<string, FootnoteRef>(),
    footnotes: new Map<string, FootnoteToken>(),
  };

  // Clear all footnotes (useful for new content)
  clearFootnotes() {
    this.footnotes.refs.clear();
    this.footnotes.footnotes.clear();
  }

  // Get footnote by label
  getFootnote(label: string): FootnoteToken | undefined {
    return this.footnotes.footnotes.get(label);
  }

  // Get footnote reference by label
  getFootnoteRef(label: string): FootnoteRef | undefined {
    return this.footnotes.refs.get(label);
  }

  // Add footnote
  addFootnote(label: string, footnote: FootnoteToken) {
    this.footnotes.footnotes.set(label, footnote);
  }

  // Add footnote reference
  addFootnoteRef(label: string, ref: FootnoteRef) {
    this.footnotes.refs.set(label, ref);
  }
}

export const FootNotesContext = createContext<FootNotes | null>(null);
export const useFootNotes = (): FootNotes => {
  const context = useContext(FootNotesContext);
  if (!context) {
    throw new Error("useFootNotes must be used within a FootNotesProvider");
  }
  return context;
};
