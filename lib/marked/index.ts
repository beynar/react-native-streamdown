import {
  Lexer,
  type MarkedToken,
  type RendererExtensionFunction,
  type TokenizerExtensionFunction,
  type TokenizerStartFunction,
  type Tokens,
} from "marked";
import { markedAlert, type AlertToken } from "./marked-alert";
import { markedFootnote, type FootnoteToken } from "./marked-footnotes";
import { markedMath, type MathToken } from "./marked-math";
import { markedSubSup, type SubSupToken } from "./marked-subsup";
import { markedList, type ListItemToken, type ListToken } from "./marked-list";
import { markedBr, type BrToken } from "./marked-br";
import { markedHr, type HrToken } from "./marked-hr";
import {
  markedTable,
  type TableToken,
  type THead,
  type TBody,
  type TFoot,
  type THeadRow,
  type TRow,
  type TH,
  type TD,
} from "./marked-table";
import { FootNotes } from "../context";

export type StreamdownToken =
  | Exclude<MarkedToken, Tokens.List | Tokens.ListItem | Tokens.TableCell>
  | ListToken
  | ListItemToken
  | MathToken
  | AlertToken
  | FootnoteToken
  | SubSupToken
  | BrToken
  | HrToken
  | TableToken
  | THead
  | TBody
  | TFoot
  | THeadRow
  | TRow
  | TH
  | TD;

// Re-export table types from marked-table
export type {
  TableToken,
  THead,
  TBody,
  TFoot,
  THeadRow,
  TRow,
  TH,
  TD,
} from "./marked-table";

const extensions = [
  markedTable(),
  markedFootnote({ footnotes: new FootNotes() }),
  markedAlert(),
  markedMath(),
  markedSubSup(),
  markedList(),
  markedBr(),
  markedHr(),
] as const;

const parseExtensions = (...ext: (typeof extensions)[number][]) => {
  const options: {
    gfm: boolean;
    extensions: {
      block: TokenizerExtensionFunction[];
      inline: TokenizerExtensionFunction[];
      childTokens: Record<string, string[]>;
      renderers: Record<string, RendererExtensionFunction>;
      startBlock: TokenizerStartFunction[];
      startInline: TokenizerStartFunction[];
    };
  } = {
    gfm: true,

    extensions: {
      block: [],
      inline: [],
      childTokens: {},
      renderers: {},
      startBlock: [],
      startInline: [],
    },
  };

  ext.forEach(({ extensions }) => {
    extensions.forEach(({ level, name, tokenizer, ...rest }) => {
      if ("start" in rest && rest.start) {
        if (level === "block") {
          options.extensions.startBlock!.push(
            rest.start as TokenizerStartFunction
          );
        } else {
          options.extensions.startInline!.push(
            rest.start as TokenizerStartFunction
          );
        }
      }
      if (tokenizer) {
        if (level === "block") {
          options.extensions.block.push(tokenizer);
        } else {
          options.extensions.inline.push(tokenizer);
        }
      }
    });
  });
  return options;
};

export const lex = (
  markdown: string,
  footnotes: FootNotes
): StreamdownToken[] => {
  return new Lexer(
    parseExtensions(
      markedHr(),
      markedTable(),
      markedFootnote({ footnotes }),
      markedAlert(),
      markedMath(),
      markedSubSup(),
      markedList(),
      markedBr()
    )
  )
    .lex(markdown)
    .filter(
      (token) => token.type !== "space" && token.type !== "footnote"
    ) as StreamdownToken[];
};

export const parseBlocks = (
  markdown: string,
  footnotes: FootNotes
): string[] => {
  return new Lexer(
    parseExtensions(markedHr(), markedFootnote({ footnotes }), markedTable())
  )
    .blockTokens(markdown, [])
    .reduce((acc, block) => {
      if (block.type === "space" || block.type === "footnote") {
        return acc;
      } else {
        acc.push(block.raw);
      }
      return acc;
    }, [] as string[]);
};

export type {
  MathToken,
  AlertToken,
  FootnoteToken,
  SubSupToken,
  BrToken,
  HrToken,
};
