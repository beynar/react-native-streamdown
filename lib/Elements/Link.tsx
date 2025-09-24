import React, { memo } from "react";
import { Text, Linking } from "react-native";
import { useStreamDown } from "../context";
import { transformUrl } from "../utils/url";
import Slot from "./Slot";
import type { Tokens } from "marked";

interface LinkProps {
  children: React.ReactNode;
  token: Tokens.Link;
}

export const Link = memo<LinkProps>(({ children, token }) => {
  const streamdown = useStreamDown();

  const transformedUrl = transformUrl(
    token.href,
    streamdown.allowedLinkPrefixes || [],
    streamdown.defaultOrigin
  );

  const handlePress = () => {
    if (transformedUrl && transformedUrl !== "streamdown:incomplete-link") {
      Linking.openURL(transformedUrl).catch((error) => {
        console.warn("Failed to open URL:", error);
      });
    }
  };

  if (transformedUrl || token.href === "streamdown:incomplete-link") {
    return (
      <Slot
        props={{
          href: transformedUrl,
          title: token.title,
          children,
          token,
        }}
        render={streamdown.snippets.link}
      >
        <Text
          style={streamdown.theme.link.base}
          onPress={transformedUrl ? handlePress : undefined}
          disabled={!transformedUrl}
        >
          {children}
        </Text>
      </Slot>
    );
  } else {
    return (
      <Text style={streamdown.theme.link.blocked}>{children} [blocked]</Text>
    );
  }
});

export default Link;
