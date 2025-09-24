import React, { memo } from "react";
import { View, Text } from "react-native";
import { useStreamDown } from "../context";
import { Tokens } from "marked";

interface MathProps {
  token: Tokens.Code;
}

export const Code = memo<MathProps>(({ token }) => {
  const streamdown = useStreamDown();

  // For React Native, we'll display the raw math text since KaTeX rendering
  // would require a WebView or special library. This is a fallback implementation.
  const content = token.text;

  return (
    <View style={streamdown.theme.math.block}>
      <View
        style={{
          backgroundColor: "#f9fafb",
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 8,
          padding: 16,
          marginVertical: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "monospace",
            fontSize: 16,
            color: "#374151",
            textAlign: "center",
          }}
        >
          {content}
        </Text>
      </View>
    </View>
  );
});

export default Code;
