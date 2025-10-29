/**
 * Aggressive markdown cleaner that removes all UI junk and TOC,
 * keeping only the title and actual paragraph content
 */
export function cleanMarkdown(markdown: string): string {
  const lines = markdown.split('\n');
  
  // Find the FIRST # Heading (the article title)
  let titleIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('# ') && trimmed.length > 2) {
      titleIndex = i;
      console.log('📍 Found article title at line', i, ':', trimmed);
      break;
    }
  }
  
  if (titleIndex === -1) {
    console.log('⚠️ No H1 heading found');
    return markdown;
  }
  
  const cleanedLines: string[] = [];
  cleanedLines.push(lines[titleIndex]); // Add title
  
  let i = titleIndex + 1;
  
  // Skip everything until we hit actual content (not TOC links)
  // TOC links have patterns like:
  // - [Text](URL) or [Text](URL) or plain section names
  
  const isTocOrNavLink = (line: string) => {
    const t = line.trim();
    // Match bullet list with link
    if (/^[-*]\s*\[.+?\]\(.+?\)/.test(t)) return true;
    // Match plain link
    if (/^\[.+?\]\(.+?\)/.test(t)) return true;
    // Match plain section names (just text, no markdown formatting)
    if (t && !t.includes('.') && !t.includes(',') && t.length < 100 && !/^#{2,}/.test(t)) {
      // Likely a plain TOC item like "Early Life and Education"
      return true;
    }
    return false;
  };
  
  // Skip until we find actual paragraph content (starts with a letter, has punctuation)
  const isParagraphContent = (line: string) => {
    const t = line.trim();
    if (!t) return false;
    if (t.startsWith('#')) return true; // Headings are content
    if (t.startsWith('http')) return true; // URLs are content (references)
    // Paragraph: starts with letter/word, has some length, and has punctuation
    if (/^[A-Z]/.test(t) && t.length > 50 && /[.!?,]/.test(t)) return true;
    return false;
  };
  
  // Skip TOC and junk
  while (i < lines.length) {
    const t = lines[i].trim();
    
    // Skip blank lines
    if (t === '') {
      i++;
      continue;
    }
    
    // Skip TOC/nav links
    if (isTocOrNavLink(t)) {
      console.log('Skipping TOC line:', t.substring(0, 50));
      i++;
      continue;
    }
    
    // Skip banned phrases
    if (t.includes('Fact-checked') || t.includes('Toggle theme') || t.includes('LightDarkSystem')) {
      i++;
      continue;
    }
    
    // If we hit paragraph content or a heading, stop skipping
    if (isParagraphContent(t)) {
      console.log('✅ Found content start at line', i);
      break;
    }
    
    // Unknown format, skip it
    i++;
  }
  
  // Add remaining content
  for (; i < lines.length; i++) {
    cleanedLines.push(lines[i]);
  }
  
  const result = cleanedLines.join('\n');
  console.log('✂️ Cleaned from', lines.length, 'lines to', cleanedLines.length, 'lines');
  
  return result;
}
