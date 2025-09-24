import React, { memo } from "react";
import { View, Image as RNImage, Text } from "react-native";
import { useStreamDown } from "../context";
import { transformUrl } from "../utils/url";
import Slot from "./Slot";
import type { Tokens } from "marked";

interface ImageProps {
  children: React.ReactNode;
  token: Tokens.Image;
}

export const Image = memo<ImageProps>(({ children, token }) => {
  const streamdown = useStreamDown();

  const transformedUrl = transformUrl(
    token.href,
    streamdown.allowedImagePrefixes || [],
    streamdown.defaultOrigin
  );

  if (token.href === "streamdown:incomplete-image") {
    return null;
  }

  if (transformedUrl) {
    return (
      <Slot
        props={{
          src: transformedUrl,
          alt: token.text,
          children,
          token,
        }}
        render={streamdown.snippets.image}
      >
        <View style={streamdown.theme.image.base}>
          <RNImage
            source={{ uri: transformedUrl }}
            style={streamdown.theme.image.image}
            alt={token.text}
            resizeMode="contain"
          />
        </View>
      </Slot>
    );
  } else {
    return (
      <View
        style={[
          streamdown.theme.image.base,
          {
            backgroundColor: "#f3f4f6",
            padding: 12,
            borderRadius: 8,
          },
        ]}
      >
        <Text style={{ color: "#6b7280", fontSize: 14 }}>
          [Image blocked: {token.text || "No description"}]
        </Text>
      </View>
    );
  }
});

export default Image;
