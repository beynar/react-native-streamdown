import React, { memo } from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import Svg, { Path, Circle, Line } from "react-native-svg";
import { useStreamDown } from "../context";
import Slot from "./Slot";
import type { AlertToken } from "../marked/marked-alert";

const icons = {
  note: () => (
    <Svg
      color={"#2563eb"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 16v-4" />
      <Path d="M12 8h.01" />
    </Svg>
  ),
  caution: () => (
    <Svg
      color={"#dc2626"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <Circle cx="12" cy="12" r="10" />
      <Line x1="12" x2="12" y1="8" y2="12" />
      <Line x1="12" x2="12.01" y1="16" y2="16" />
    </Svg>
  ),
  important: () => (
    <Svg
      color={"#7c3aed"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <Path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
      <Path d="M7 11h10" />
      <Path d="M7 15h6" />
      <Path d="M7 7h8" />
    </Svg>
  ),
  tip: () => (
    <Svg
      color={"#059669"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <Path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <Path d="M9 18h6" />
      <Path d="M10 22h4" />
    </Svg>
  ),
  warning: () => (
    <Svg
      color={"#d97706"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <Path d="M12 9v4" />
      <Path d="M12 17h.01" />
    </Svg>
  ),
};

const variantStyles = {
  note: { color: "#2563eb" },
  tip: { color: "#059669" },
  warning: { color: "#d97706" },
  caution: { color: "#dc2626" },
  important: { color: "#7c3aed" },
} satisfies Record<AlertToken["variant"], TextStyle>;

interface AlertProps {
  children: React.ReactNode;
  token: AlertToken;
}

export const Alert = memo<AlertProps>(({ children, token }) => {
  const streamdown = useStreamDown();
  const IconComponent = icons[token.variant];

  return (
    <Slot
      props={{
        children,
        token,
      }}
      render={streamdown.snippets.alert}
    >
      <View
        style={[
          streamdown.theme.alert.base,
          streamdown.theme.alert[token.variant],
        ]}
      >
        <View
          style={[
            streamdown.theme.alert.title,
            { flexDirection: "row", alignItems: "flex-start" },
          ]}
        >
          <View style={[streamdown.theme.alert.icon]}>
            <IconComponent />
          </View>
          <Text
            style={[streamdown.theme.alert.title, variantStyles[token.variant]]}
          >
            {token.variant}
          </Text>
        </View>
        {children}
      </View>
    </Slot>
  );
});

export default Alert;
