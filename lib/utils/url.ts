export function transformUrl(
  url: string,
  allowedPrefixes: string[] = [],
  defaultOrigin?: string
): string | null {
  if (!url) return null;

  // Allow special markers
  if (url.startsWith("streamdown:")) {
    return url;
  }

  // If no allowed prefixes are specified, allow all URLs
  if (allowedPrefixes.length === 0) {
    return url;
  }

  // Check if URL matches any allowed prefix
  const isAllowed = allowedPrefixes.some((prefix) => {
    if (prefix.endsWith("*")) {
      // Wildcard prefix
      return url.startsWith(prefix.slice(0, -1));
    }
    return url.startsWith(prefix);
  });

  if (isAllowed) {
    return url;
  }

  // If URL is relative and we have a default origin, resolve it
  if (url.startsWith("/") && defaultOrigin) {
    const resolvedUrl = new URL(url, defaultOrigin).toString();
    // Check again with resolved URL
    const isResolvedAllowed = allowedPrefixes.some((prefix) => {
      if (prefix.endsWith("*")) {
        return resolvedUrl.startsWith(prefix.slice(0, -1));
      }
      return resolvedUrl.startsWith(prefix);
    });

    if (isResolvedAllowed) {
      return resolvedUrl;
    }
  }

  // URL is not allowed
  return null;
}
