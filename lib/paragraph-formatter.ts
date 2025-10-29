/**
 * Adds paragraph breaks where sentences are concatenated without spaces
 */
export function formatParagraphs(markdown: string): string {
  console.log('📄 Starting paragraph formatting...');
  
  // Find a sample citation to see the exact format
  const sampleMatch = markdown.match(/\\\?\[\d+\\\?\]/);
  if (sampleMatch) {
    console.log('Sample citation found:', sampleMatch[0]);
  }
  
  let formatted = markdown;
  let replacementCount = 0;
  
  // Pattern 1: Escaped citation \[N\] followed immediately by capital letter
  // Example: "2000.\[9\]In May" → "2000.\[9\]\n\nIn May"
  const pattern1Before = formatted.length;
  formatted = formatted.replace(/(\\\[\d+\\\])([A-Z])/g, (match, p1, p2) => {
    replacementCount++;
    console.log(`  ✓ Pattern 1: "${match}" → "${p1}\\n\\n${p2}"`);
    return p1 + '\n\n' + p2;
  });
  console.log(`Pattern 1 (\\[N\\] + Capital): ${replacementCount} replacements`);
  
  // Pattern 2: Multiple escaped citations followed by capital letter
  // Example: "\[10\]\[11\]\[12\]She" → "\[10\]\[11\]\[12\]\n\nShe"
  replacementCount = 0;
  formatted = formatted.replace(/((?:\\\[\d+\\\])+)([A-Z])/g, (match, p1, p2) => {
    replacementCount++;
    console.log(`  ✓ Pattern 2: "${match}" → paragraph break`);
    return p1 + '\n\n' + p2;
  });
  console.log(`Pattern 2 (Multiple \\[N\\] + Capital): ${replacementCount} replacements`);
  
  // Pattern 3: Period followed immediately by capital letter (no space)
  // Example: "Reserve.They" → "Reserve.\n\nThey"
  replacementCount = 0;
  formatted = formatted.replace(/([a-z]\.)([A-Z][a-z])/g, (match, p1, p2, offset) => {
    // Check if it's not an abbreviation
    const before = formatted.substring(Math.max(0, offset - 10), offset);
    if (/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|Ave|Inc|Corp|Ltd|vs|etc|i\.e|e\.g)$/i.test(before + p1)) {
      return match; // Keep as-is
    }
    replacementCount++;
    console.log(`  ✓ Pattern 3: "${match}" → "${p1}\\n\\n${p2}"`);
    return p1 + '\n\n' + p2;
  });
  console.log(`Pattern 3 (Period + Capital): ${replacementCount} replacements`);
  
  console.log('✅ Paragraph formatting complete');
  
  return formatted;
}

