import React, { memo, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { useStreamDown } from "../context";
import type { StreamdownToken } from "../marked";
import Slot from "./Slot";
import Link from "./Link";
import Image from "./Image";
import Math from "./Math";
import Alert from "./Alert";
import FootnoteRef from "./FootnoteRef";
import Code from "./Code";
import { Styled } from "../Styled";
import Mermaid from "./Mermaid";

// Simple list item component
const ListItemComponent = memo<{
  token: any;
  children: React.ReactNode;
}>(({ token, children }) => {
  const streamdown = useStreamDown();

  const getMarker = () => {
    if (token.task) {
      return token.checked ? "☑️" : "☐";
    }

    // Use the formatted value if available, otherwise check numeric value
    if (token.formattedValue) {
      return token.formattedValue;
    } else if (token.value !== null && token.value !== undefined) {
      return `${token.value}.`;
    }

    return "•";
  };

  return (
    <View style={streamdown.theme.li.base}>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          textAlign: "left",
          marginRight: 4,
        }}
      >
        {getMarker()}
      </Text>
      <Text>{children}</Text>
    </View>
  );
});

interface ElementProps {
  token: StreamdownToken;
  children?: React.ReactNode;
}

export const Element = memo<ElementProps>(
  ({ token, children }) => {
    const streamdown = useStreamDown();
    switch (token.type) {
      case "paragraph":
        return (
          <Slot
            props={{ children, token }}
            render={streamdown.snippets.paragraph}
          >
            <Text style={streamdown.theme.paragraph.base}>{children}</Text>
          </Slot>
        );

      case "heading":
        return (
          <Slot
            props={{
              children,
              token,
            }}
            render={streamdown.snippets.heading}
          >
            {token.depth === 1 && (
              <Text style={streamdown.theme.h1.base}>{children}</Text>
            )}
            {token.depth === 2 && (
              <Text style={streamdown.theme.h2.base}>{children}</Text>
            )}
            {token.depth === 3 && (
              <Text style={streamdown.theme.h3.base}>{children}</Text>
            )}
            {token.depth === 4 && (
              <Text style={streamdown.theme.h4.base}>{children}</Text>
            )}
            {token.depth === 5 && (
              <Text style={streamdown.theme.h5.base}>{children}</Text>
            )}
            {token.depth === 6 && (
              <Text style={streamdown.theme.h6.base}>{children}</Text>
            )}
          </Slot>
        );

      case "blockquote":
        return (
          <Slot
            props={{ children, token }}
            render={streamdown.snippets.blockquote}
          >
            <Text style={streamdown.theme.blockquote.base}>{children}</Text>
          </Slot>
        );

      case "codespan":
        return (
          <Slot
            props={{ children, token }}
            render={streamdown.snippets.codespan}
          >
            <Text style={streamdown.theme.codespan.base}>{children}</Text>
          </Slot>
        );

      case "code": {
        if (token.lang === "mermaid") {
          return (
            <Slot
              props={{ children, token }}
              render={streamdown.snippets.mermaid}
            >
              <Mermaid token={token as any} />
            </Slot>
          );
        } else {
          return (
            <Slot props={{ children, token }} render={streamdown.snippets.code}>
              <Code token={token as any} />
            </Slot>
          );
        }
      }

      case "list":
        const listToken = token as any;
        if (listToken.ordered) {
          return (
            <Slot props={{ children, token }} render={streamdown.snippets.ol}>
              <View style={streamdown.theme.ol.base}>{children}</View>
            </Slot>
          );
        } else {
          return (
            <Slot props={{ children, token }} render={streamdown.snippets.ul}>
              <View style={streamdown.theme.ul.base}>{children}</View>
            </Slot>
          );
        }

      case "list_item":
        const listItemToken = token as any;
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.li}>
            <ListItemComponent token={listItemToken} children={children} />
          </Slot>
        );

      case "table":
        return (
          <Slot props={{ token, children }} render={streamdown.snippets.table}>
            <View style={streamdown.theme.table.base}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ minWidth: "100%" }}>{children}</View>
              </ScrollView>
            </View>
          </Slot>
        );

      case "thead":
        return (
          <Slot props={{ token, children }} render={streamdown.snippets.thead}>
            <View style={streamdown.theme.thead.base}>{children}</View>
          </Slot>
        );

      case "tbody":
        return (
          <Slot props={{ token, children }} render={streamdown.snippets.tbody}>
            <View style={streamdown.theme.tbody.base}>{children}</View>
          </Slot>
        );

      case "tfoot":
        return (
          <Slot props={{ token, children }} render={streamdown.snippets.tfoot}>
            <View style={streamdown.theme.tfoot.base}>{children}</View>
          </Slot>
        );

      case "tr":
        return (
          <Slot props={{ token, children }} render={streamdown.snippets.tr}>
            <View style={[streamdown.theme.tr.base, { flexDirection: "row" }]}>
              {children}
            </View>
          </Slot>
        );

      case "td":
        const tdToken = token as any;
        if (tdToken.rowspan > 0) {
          // Calculate flex value based on colspan (simulate colspan)
          const flexValue =
            tdToken.colspan && tdToken.colspan > 1 ? tdToken.colspan : 1;
          const minWidth = flexValue * 100; // Base width per column
          const minHeight = (tdToken.rowspan || 1) * 44; // Base height per row

          return (
            <Slot props={{ children, token }} render={streamdown.snippets.td}>
              <View
                style={{
                  flex: flexValue,
                  minWidth: minWidth,
                  minHeight: minHeight,
                  justifyContent: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRightWidth: 1,
                  borderRightColor: "#e5e7eb",
                }}
              >
                <Text style={[streamdown.theme.td.base, { textAlign: "left" }]}>
                  {children}
                </Text>
              </View>
            </Slot>
          );
        }
        return null;

      case "th":
        const thToken = token as any;
        if (thToken.rowspan > 0) {
          // Calculate flex value based on colspan (simulate colspan)
          const flexValue =
            thToken.colspan && thToken.colspan > 1 ? thToken.colspan : 1;
          const minWidth = flexValue * 100; // Base width per column
          const minHeight = (thToken.rowspan || 1) * 44; // Base height per row

          return (
            <Slot props={{ children, token }} render={streamdown.snippets.th}>
              <View
                style={{
                  flex: flexValue,
                  minWidth: minWidth,
                  minHeight: minHeight,
                  justifyContent: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRightWidth: 1,
                  borderRightColor: "#d1d5db",
                  backgroundColor: "#f9fafb",
                }}
              >
                <Text style={[streamdown.theme.th.base, { textAlign: "left" }]}>
                  {children}
                </Text>
              </View>
            </Slot>
          );
        }
        return null;

      case "image":
        return <Image token={token} children={children} />;

      case "link":
        return <Link token={token} children={children} />;

      case "sub":
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.sub}>
            <Text style={streamdown.theme.sub.base}>{children}</Text>
          </Slot>
        );

      case "sup":
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.sup}>
            <Text style={streamdown.theme.sup.base}>{children}</Text>
          </Slot>
        );

      case "strong": {
        if (token.text === "Svelte port") {
          console.log("Rendering strong", token.text);
        }
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.strong}>
            <Text style={streamdown.theme.strong.base}>{children}</Text>
          </Slot>
        );
      }

      case "em":
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.em}>
            <Text style={streamdown.theme.em.base}>{children}</Text>
          </Slot>
        );

      case "del":
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.del}>
            <Text style={streamdown.theme.del.base}>{children}</Text>
          </Slot>
        );

      case "hr":
        return (
          <Slot props={{ children, token }} render={streamdown.snippets.hr}>
            <View style={streamdown.theme.hr.base} />
          </Slot>
        );

      case "br":
        return <View style={streamdown.theme.br.base} />;

      case "math":
        return (
          <Slot
            props={{
              children,
              token,
            }}
            render={streamdown.snippets.math}
          >
            <Math token={token as any} />
          </Slot>
        );

      case "alert":
        return <Alert token={token as any} children={children} />;

      case "footnoteRef":
        return <FootnoteRef token={token as any} />;

      case "html":
        if (streamdown.renderHtml) {
          const htmlToken = token as any;
          const content =
            typeof streamdown.renderHtml === "function"
              ? streamdown.renderHtml(htmlToken)
              : htmlToken.raw;
          // Note: React Native doesn't support HTML rendering directly
          // This would need a WebView or HTML renderer library
          return <Text style={{ fontFamily: "monospace" }}>{content}</Text>;
        }
        return null;

      default:
        // For tokens we don't handle specifically, render children or fallback
        return children;
    }
  },
  (prevProps, nextProps) => {
    // Check token equality by raw content and type for performance
    return prevProps.token.raw === nextProps.token.raw;
  }
);

export default Element;
