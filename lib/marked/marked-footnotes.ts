import type { TokenizerExtensionFunction, TokenizerThis } from "marked";
import { type StreamdownToken } from "./index";
import { type FootNotes } from "../context";

export function markedFootnote({ footnotes }: { footnotes: FootNotes }): {
  extensions: {
    name: string;
    level: "block" | "inline";
    tokenizer: TokenizerExtensionFunction;
  }[];
} {
  return {
    extensions: [
      {
        name: "footnote",
        level: "block",
        tokenizer(this: TokenizerThis, src: string) {
          const match =
            /^\[\^([^\]\n]+)\]:(?:[ \t]+|[\n]*?|$)([^\n]*?(?:\n|$)(?:\n*?[ ]{4,}[^\n]*)*)/.exec(
              src
            );

          if (match) {
            const [raw, label, text = ""] = match;
            let content = text.split("\n").reduce((acc, curr) => {
              return acc + "\n" + curr.replace(/^(?:[ ]{4}|[\t])/, "");
            }, "");

            const contentLastLine = content.trimEnd().split("\n").pop();

            content +=
              // add lines after list, blockquote, codefence, and table
              contentLastLine &&
              /^[ \t]*?[>\-*][ ]|[`]{3,}$|^[ \t]*?[|].+[|]$/.test(
                contentLastLine
              )
                ? "\n\n"
                : "";

            const lines = content.split("\n");

            const token: Footnote = {
              type: "footnote",
              raw,
              label,
              lines,
              tokens: [],
            };
            footnotes.addFootnote(label, token);

            const ref = footnotes.getFootnoteRef(label);

            if (ref) {
              ref.content = token;
            }
            return token as any;
          }
        },
      },
      {
        name: "footnoteRef",
        level: "inline",
        tokenizer(this: TokenizerThis, src: string) {
          const match = /^\[\^([^\]\n]+)\]/.exec(src);

          if (match) {
            const [raw, label] = match;

            const footnote = footnotes.getFootnote(label);

            const token: FootnoteRef = {
              type: "footnoteRef",
              raw,
              label,
              content: (footnote && footnote.type === "footnote"
                ? footnote
                : {
                    type: "footnote",
                    raw,
                    label,
                    lines: [],
                    tokens: [],
                  }) as Footnote,
            };
            footnotes.addFootnoteRef(label, token);
            return token;
          }
        },
      },
    ],
  };
}

/**
 * Represents a single footnote.
 */
export type Footnote = {
  type: "footnote";
  raw: string;
  label: string;
  tokens: StreamdownToken[];
  lines: string[];
};

/**
 * Represents a reference to a footnote.
 */
export type FootnoteRef = {
  type: "footnoteRef";
  raw: string;
  label: string;
  content: Footnote;
};

export type FootnoteToken = Footnote | FootnoteRef;
