import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StreamDown } from "./lib";
import { readMe } from "./test";

export default function App() {
  const [text, setText] = useState("");

  const progressPercentage = useRef(0);
  const interval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);
  const simulateStream = () => {
    // Reset progress and text
    progressPercentage.current = 0;
    setText("");
    startTime.current = Date.now();

    const totalLength = readMe.length;
    interval.current = setInterval(() => {
      const progress = Math.min(progressPercentage.current + 0.5, 1); // Slower increment for better streaming effect
      progressPercentage.current = progress;
      const characterIndex = Math.floor(progress * totalLength);
      setText(readMe.slice(0, characterIndex));

      // Update performance stats

      if (progress >= 1) {
        clearInterval(interval.current);
      }
    }, 50); // Faster updates for smoother streaming
  };

  const stopStream = () => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = null;
    }
    setText(readMe);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10, flexDirection: "row", gap: 10 }}>
        <TouchableOpacity style={styles.button} onPress={simulateStream}>
          <Text style={styles.buttonText}>🚀 Start Stream</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopStream}>
          <Text style={styles.buttonText}>⏹️ Stop</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{
          maxWidth: "100%",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          padding: 10,
          flex: 1,
        }}
      >
        <StreamDown enableStreamingAnimations={true}>{text}</StreamDown>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "column",
    paddingTop: 100,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  statsContainer: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  statsText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
});
