import { StreamDownTheme } from "./context";

export const theme: StreamDownTheme = {
  link: {
    base: {
      color: "#2563eb",
      fontWeight: "500",
      textDecorationLine: "underline",
    },
    blocked: {
      color: "#6b7280",
    },
  },
  h1: {
    base: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 30,
      fontWeight: "600",
      color: "#111827",
      lineHeight: 30,
    },
  },
  h2: {
    base: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 24,
      fontWeight: "600",
      color: "#111827",
    },
  },
  h3: {
    base: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 20,
      fontWeight: "600",
      color: "#111827",
    },
  },
  h4: {
    base: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 18,
      fontWeight: "600",
      color: "#111827",
    },
  },
  h5: {
    base: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 16,
      fontWeight: "600",
      color: "#111827",
    },
  },
  h6: {
    base: {
      marginTop: 24,
      marginBottom: 8,
      fontSize: 14,
      fontWeight: "600",
      color: "#111827",
    },
  },
  paragraph: {
    base: {
      marginBottom: 8,
      color: "#374151",
    },
  },
  ul: {
    base: {
      marginLeft: 2,
      marginVertical: 4,
    },
  },
  ol: {
    base: {
      marginLeft: 2,
      marginVertical: 4,
    },
  },
  li: {
    base: {
      paddingVertical: 4,
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      flexShrink: 1,
      flexWrap: "nowrap",
    },
    checkbox: {
      marginRight: 8,
      marginTop: 2,
    },
  },
  codespan: {
    base: {
      backgroundColor: "#f3f4f6",
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontFamily: "monospace",
      fontSize: 14,
    },
  },
  image: {
    base: {
      marginVertical: 16,
      alignItems: "center",
    },
    image: {
      maxWidth: "100%",
      borderRadius: 8,
    },
  },
  blockquote: {
    base: {
      borderLeftWidth: 4,
      borderLeftColor: "#9ca3af",
      paddingLeft: 16,
      marginVertical: 16,
    },
  },
  alert: {
    base: {
      marginVertical: 16,
      borderLeftWidth: 4,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 4,
    },
    title: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      textTransform: "capitalize",
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: 8,
    },
    note: {
      borderLeftColor: "#2563eb",
      backgroundColor: "#eff6ff",
    },
    tip: {
      borderLeftColor: "#059669",
      backgroundColor: "#ecfdf5",
    },
    warning: {
      borderLeftColor: "#d97706",
      backgroundColor: "#fffbeb",
    },
    caution: {
      borderLeftColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
    important: {
      borderLeftColor: "#7c3aed",
      backgroundColor: "#f5f3ff",
    },
  },
  table: {
    base: {
      marginVertical: 16,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 8,
    },
    table: {
      width: "100%",
    },
  },
  thead: {
    base: {
      backgroundColor: "#f9fafb",
    },
  },
  tbody: {
    base: {},
  },
  tfoot: {
    base: {
      backgroundColor: "#f3f4f6",
      borderTopWidth: 1,
      borderTopColor: "#d1d5db",
    },
  },
  tr: {
    base: {
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
    },
  },
  td: {
    base: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      color: "#374151",
    },
  },
  th: {
    base: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 14,
      fontWeight: "600",
      color: "#111827",
    },
  },
  sup: {
    base: {
      fontSize: 12,
      lineHeight: 12,
    },
  },
  sub: {
    base: {
      fontSize: 12,
      lineHeight: 24,
    },
  },
  hr: {
    base: {
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      marginVertical: 24,
    },
  },
  strong: {
    base: {
      fontWeight: "600",
    },
  },
  math: {
    block: {
      marginVertical: 16,
      borderRadius: 8,
      overflow: "hidden",
    },
    inline: {
      marginHorizontal: 2,
      borderRadius: 4,
      overflow: "hidden",
      height: 30,
    },
  },
  br: {
    base: {
      height: 16,
    },
  },
  em: {
    base: {
      fontStyle: "italic",
    },
  },
  del: {
    base: {
      textDecorationLine: "line-through",
      color: "#6b7280",
    },
  },
  footnoteRef: {
    base: {
      color: "#6b7280",
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: "#f3f4f6",
    },
  },
  footnotePopover: {
    base: {
      position: "absolute",
      zIndex: 50,
      maxHeight: "30%",
      maxWidth: "90%",
      backgroundColor: "#ffffff",
      borderRadius: 8,
      padding: 16,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  mermaid: {
    base: {
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 8,
      minHeight: 200,
      marginVertical: 16,
      overflow: "hidden",
    },
  },
};
