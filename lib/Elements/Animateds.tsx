import { memo, useEffect, useMemo, useRef } from "react";
import { useAnimatedValue } from "react-native";
import { Animated, View, Text } from "react-native";
import ReAnimated, { FadeIn } from "react-native-reanimated";
import { useStyle } from "../Styled";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export const AnimatedText = ({ text }: AnimatedTextProps) => {
  const tokens = useMemo(() => {
    if (!text) return [];
    const splitRegex = /(\s+)/;
    return text.split(splitRegex).filter((token) => token.length > 0);
  }, [text]);

  return tokens.map((token, index) => (
    <AnimatedToken key={`${token}-${index}`} token={token} />
  ));
  return tokens.map((token, index) => (
    <Text key={`${token}-${index}`}>{token}</Text>
  ));
};

interface AnimatedTokenProps {
  token: string;
}

const AnimatedToken = ({ token }: AnimatedTokenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const style = useStyle();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // slightly longer
      useNativeDriver: true,
    }).start();
  }, []); // run only once on mount

  return (
    <Animated.Text
      style={{
        opacity: fadeAnim,
        ...style,
      }}
    >
      {token}
    </Animated.Text>
  );
};

interface AnimatedBlockProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const AnimatedBlock = ({ children }: AnimatedBlockProps) => {
  return <View>{children}</View>;
};
