import { createContext, useContext, useMemo } from "react";
import { Text, TextStyle, View, ViewStyle } from "react-native";

const TextStyleContext = createContext<TextStyle>({});

const textStyleKeys = new Set<keyof TextStyle>([
  "color",
  "fontSize",
  "fontWeight",
  "fontFamily",
  "textAlign",
  "textDecorationLine",
  "textTransform",
  "letterSpacing",
  "lineHeight",
  "textShadowColor",
  "textShadowOffset",
  "textShadowRadius",
]);

const StyledView = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style: ViewStyle & TextStyle;
}) => {
  const { viewStyle, textStyle } = useMemo(() => {
    const viewStyle = {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap",
    } satisfies ViewStyle;
    const textStyle = {};
    for (const key of Object.keys(style)) {
      if (key in style) {
        textStyle[key] = style[key];
      } else {
        viewStyle[key] = style[key];
      }
    }
    return {
      viewStyle,
      textStyle,
    };
  }, [style]);
  return (
    <TextStyleContext.Provider value={textStyle}>
      <View style={viewStyle}>
        <Text style={textStyle}>{children}</Text>
      </View>
    </TextStyleContext.Provider>
  );
};

export const StyledText = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style: TextStyle;
}) => {
  const textStyle = useContext(TextStyleContext);
  return <Text style={textStyle}>{children}</Text>;
};

export const Styled = {
  View: StyledView,
  Text: StyledText,
};

export const useStyle = () => {
  const textStyle = useContext(TextStyleContext);
  return textStyle;
};
