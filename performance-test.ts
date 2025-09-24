/**
 * Performance test for React Native Streamdown optimizations
 * Run this to compare before/after performance improvements
 */

import { parseBlocks, lex } from './lib/marked';
import { parseIncompleteMarkdown } from './lib/utils/parse-incomplete-markdown';
import { parseIncompleteMarkdownOptimized, getCacheStats, clearPerformanceCaches } from './lib/utils/performance';

// Generate test content of varying sizes
const generateTestContent = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
  const baseContent = `
# Test Heading

This is a **bold** text with *italic* and \`inline code\`.

> A blockquote with [links](https://example.com) and images.

\`\`\`javascript
const code = "block";
console.log(code);
\`\`\`

- List item 1
- List item 2
  - Nested item
  - Another nested item

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

Math: $E = mc^2$ and block math:

$$
\\frac{d}{dx}f(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}
$$

~subscript~ and ^superscript^

> [!NOTE]
> This is a note alert with **formatting**.

[^1]: This is a footnote.
`;

  const multipliers = {
    small: 1,
    medium: 5,
    large: 20,
    xlarge: 50
  };

  return baseContent.repeat(multipliers[size]);
};

// Performance testing functions
const measureTime = (fn: () => any, iterations: number = 100): number => {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = Date.now();
  return end - start;
};

const runPerformanceTest = () => {
  console.log('🚀 React Native Streamdown Performance Test\n');

  const testSizes: Array<'small' | 'medium' | 'large' | 'xlarge'> = ['small', 'medium', 'large', 'xlarge'];
  
  testSizes.forEach(size => {
    console.log(`\n📊 Testing ${size.toUpperCase()} content:`);
    const content = generateTestContent(size);
    console.log(`   Content length: ${content.length} characters`);

    // Clear caches before each test
    clearPerformanceCaches();

    // Test parsing performance
    const parseTime = measureTime(() => parseBlocks(content), 10);
    console.log(`   Block parsing: ${parseTime}ms`);

    // Test incomplete markdown processing (original)
    const originalTime = measureTime(() => parseIncompleteMarkdown(content), 50);
    console.log(`   Original incomplete parsing: ${originalTime}ms`);

    // Test optimized incomplete markdown processing
    const optimizedTime = measureTime(() => parseIncompleteMarkdownOptimized(content), 50);
    console.log(`   Optimized incomplete parsing: ${optimizedTime}ms`);

    // Test cached performance (second run)
    const cachedTime = measureTime(() => parseIncompleteMarkdownOptimized(content), 50);
    console.log(`   Cached incomplete parsing: ${cachedTime}ms`);

    // Test lexing performance
    const processed = parseIncompleteMarkdownOptimized(content);
    const lexTime = measureTime(() => lex(processed), 10);
    console.log(`   Token lexing: ${lexTime}ms`);

    // Show improvement
    const improvement = ((originalTime - optimizedTime) / originalTime * 100).toFixed(1);
    const cacheImprovement = ((originalTime - cachedTime) / originalTime * 100).toFixed(1);
    
    console.log(`   ✅ Improvement: ${improvement}% faster`);
    console.log(`   🚀 Cache improvement: ${cacheImprovement}% faster`);

    // Show cache stats
    const stats = getCacheStats();
    console.log(`   📈 Cache size: ${stats.incompleteMarkdownCacheSize}/${stats.incompleteMarkdownCacheMaxSize}`);
  });

  console.log('\n🎯 Performance Test Complete!');
  console.log('\n💡 Key Optimizations Applied:');
  console.log('   • Parsing result caching');
  console.log('   • Optimized React memoization');
  console.log('   • Shallow comparison strategies');
  console.log('   • Early exit conditions');
  console.log('   • Memory-efficient token processing');
};

// Memory usage test
const measureMemoryUsage = () => {
  console.log('\n🧠 Memory Usage Test:');
  
  const content = generateTestContent('xlarge');
  
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  const initialMemory = process.memoryUsage();
  
  // Process content multiple times
  for (let i = 0; i < 100; i++) {
    parseIncompleteMarkdownOptimized(content);
    lex(parseIncompleteMarkdownOptimized(content));
  }
  
  const finalMemory = process.memoryUsage();
  
  console.log(`   Initial heap: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Final heap: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Heap growth: ${((finalMemory.heapUsed - initialMemory.heapUsed) / 1024 / 1024).toFixed(2)} MB`);
  
  const stats = getCacheStats();
  console.log(`   Cache entries: ${stats.incompleteMarkdownCacheSize}`);
};

// Export for use in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runPerformanceTest,
    measureMemoryUsage,
    generateTestContent
  };
}

// Run tests if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runPerformanceTest();
  measureMemoryUsage();
}
