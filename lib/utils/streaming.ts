/**
 * Utility functions for streaming AI content optimization
 */
import React from "react";

export interface StreamingStats {
  totalCharacters: number;
  blocksCount: number;
  lastUpdateTime: number;
  streamingRate: number; // characters per second
}

/**
 * Hook to track streaming performance metrics
 */
export const useStreamingStats = (content: string): StreamingStats => {
  const [stats, setStats] = React.useState<StreamingStats>({
    totalCharacters: 0,
    blocksCount: 0,
    lastUpdateTime: Date.now(),
    streamingRate: 0,
  });

  React.useEffect(() => {
    const now = Date.now();
    const timeDiff = now - stats.lastUpdateTime;
    const charDiff = content.length - stats.totalCharacters;

    // Calculate streaming rate (chars per second)
    const rate = timeDiff > 0 ? (charDiff / timeDiff) * 1000 : 0;

    setStats({
      totalCharacters: content.length,
      blocksCount: content.split("\n\n").length,
      lastUpdateTime: now,
      streamingRate: rate,
    });
  }, [content]);

  return stats;
};
