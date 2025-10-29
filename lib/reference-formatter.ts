import { formatParagraphs } from './paragraph-formatter';

export interface ReferenceProcessingResult {
  content: string;
  references: Map<number, ParsedReference>;
  attribution?: string;
}

export interface ParsedReference {
  number: number;
  url?: string;
  title?: string;
  source?: string;
  fullText: string;
  isValid: boolean;
}

/**
 * Processes markdown to extract references and convert citations to superscripts.
 */
export function processMarkdownWithReferences(markdown: string): ReferenceProcessingResult {
  console.log('🔄 Processing markdown for references...');
  
  const formattedMarkdown = formatParagraphs(markdown);
  const lines = formattedMarkdown.split('\n');
  
  let referencesStartIndex = -1;
  let attributionLine = '';
  
  for (let i = 0; i < lines.length; i++) {
    if (/^#{1,3}\s*references\s*$/i.test(lines[i].trim())) {
      referencesStartIndex = i;
      console.log('📍 Found References heading at line', i);
      break;
    }
  }
  
  if (referencesStartIndex === -1) {
    console.log('⚠️ No References section found');
    return { content: markdown, references: new Map() };
  }
  
  // Look for attribution
  for (let i = referencesStartIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/^The content is adapted from/i.test(trimmed)) {
      attributionLine = trimmed;
      break;
    }
  }
  
  // Extract references - KEEP ALL with their original numbers
  const references = new Map<number, ParsedReference>();
  let currentRefNumber = 0;
  let currentRefText = '';
  
  for (let i = referencesStartIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === '') {
      if (currentRefText && currentRefNumber > 0) {
        const parsed = parseReference(currentRefNumber, currentRefText);
        references.set(currentRefNumber, parsed);
        currentRefText = '';
        currentRefNumber = 0;
      }
      continue;
    }
    
    if (/^The content is adapted from/i.test(trimmed)) break;
    
    // Check if this is a new reference number
    const numberMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (numberMatch) {
      // Save previous reference
      if (currentRefText && currentRefNumber > 0) {
        const parsed = parseReference(currentRefNumber, currentRefText);
        references.set(currentRefNumber, parsed);
      }
      currentRefNumber = parseInt(numberMatch[1]);
      currentRefText = numberMatch[2];
    } else {
      // Continuation of previous reference
      currentRefText += ' ' + trimmed;
    }
  }
  
  // Don't forget the last one
  if (currentRefText && currentRefNumber > 0) {
    const parsed = parseReference(currentRefNumber, currentRefText);
    references.set(currentRefNumber, parsed);
  }
  
  console.log('📚 Found', references.size, 'references (including invalid ones)');
  
  if (references.size === 0) {
    return { content: markdown, references: new Map() };
  }
  
  // Remove old References section
  const contentLines = lines.slice(0, referencesStartIndex);
  while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === '') {
    contentLines.pop();
  }
  
  let content = contentLines.join('\n');
  
  console.log('✏️ Processing citations...');
  
  // Replace citations with superscripts
  references.forEach((ref, refNum) => {
    const hoverText = ref.title || ref.source || (ref.url ? extractBaseDomain(ref.url) : `Reference ${refNum}`);
    const linkUrl = ref.url || '#ref-' + refNum;
    const targetBlank = ref.url ? 'target="_blank" rel="noopener noreferrer"' : '';
    
    const replacement = `<sup class="citation-sup"><a href="${escapeHtml(linkUrl)}" ${targetBlank} data-cite-title="${escapeHtml(hoverText)}" class="citation-link"><span class="bracket">[</span>${refNum}<span class="bracket">]</span></a></sup>`;
    
    const escapedPattern = new RegExp(`\\\\\\[${refNum}\\\\\\](?!\\d)`, 'g');
    const normalPattern = new RegExp(`\\[${refNum}\\](?!\\d)`, 'g');
    
    content = content.replace(escapedPattern, replacement);
    content = content.replace(normalPattern, replacement);
  });
  
  const supCount = (content.match(/<sup>/g) || []).length;
  console.log(`✅ Converted ${supCount} citations to superscripts`);
  
  // Add References section
  console.log('📝 Adding References section...');
  content += '\n\n## References\n\n';
  content += '<div class="references-grid">\n\n';
  
  references.forEach((ref, refNum) => {
    content += `<div id="ref-${refNum}" class="reference-item">\n`;
    content += `<span class="reference-number">${refNum}.</span>`;
    content += `<div class="reference-content">`;
    
    if (ref.isValid && ref.url && ref.title) {
      // Rich citation with title
      content += `<a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer" class="reference-link">${escapeHtml(ref.title)}</a>`;
      if (ref.source) {
        content += ` <span class="reference-source">${escapeHtml(ref.source)}</span>`;
      }
    } else if (ref.isValid && ref.url) {
      // Simple URL
      content += `<a href="${escapeHtml(ref.url)}" target="_blank" rel="noopener noreferrer" class="reference-link">${escapeHtml(ref.url)}</a>`;
    } else {
      // Invalid/placeholder reference - show cleaned text without markdown
      const cleanedText = cleanMarkdownFormatting(ref.fullText);
      content += `<span class="reference-placeholder">${escapeHtml(cleanedText)}</span>`;
    }
    
    content += `</div>`;
    content += `</div>\n\n`;
  });
  
  content += '</div>\n';
  
  if (attributionLine) {
    const processedAttribution = attributionLine.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    content += `\n\n<div class="attribution-line">\n${processedAttribution}\n</div>\n`;
  }
  
  return { content, references, attribution: attributionLine };
}

/**
 * Parse a reference line to extract URL, title, and source
 * Keeps original number and handles invalid references
 */
function parseReference(number: number, refText: string): ParsedReference {
  // Check for simple URL format: [https://...](https://...)
  const simpleUrlMatch = refText.match(/^\[(https?:\/\/[^\]]+)\]\([^\)]+\)/);
  if (simpleUrlMatch) {
    return {
      number,
      url: simpleUrlMatch[1],
      fullText: refText,
      isValid: true
    };
  }
  
  // Check for rich citation: ["Title"](URL). Source. Date.
  const richMatch = refText.match(/\["?([^"\]]+)"?\]\(([^\)]+)\)(.*)/);
  if (richMatch) {
    const title = richMatch[1];
    const url = richMatch[2];
    const rest = richMatch[3].trim();
    
    // Extract source (in italics or after first period)
    let source = '';
    const sourceMatch = rest.match(/\.\s*_([^_]+)_|\.\s*([A-Z][^.]+?)\./);
    if (sourceMatch) {
      source = sourceMatch[1] || sourceMatch[2];
    }
    
    return {
      number,
      url,
      title,
      source,
      fullText: refText,
      isValid: true
    };
  }
  
  // Check if there's ANY URL in the text
  const urlMatch = refText.match(/(https?:\/\/[^\s\)]+)/);
  if (urlMatch) {
    return {
      number,
      url: urlMatch[1],
      fullText: refText,
      isValid: true
    };
  }
  
  // Invalid/placeholder reference (like "_**b**_" or just text)
  return {
    number,
    fullText: refText,
    isValid: false
  };
}

function extractBaseDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Remove markdown formatting from text (italics, bold, etc.)
 */
function cleanMarkdownFormatting(text: string): string {
  let cleaned = text;
  
  // Remove italics: _text_ → text
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');
  
  // Remove bold: **text** → text
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  
  // Remove bold (alternative): __text__ → text
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  
  // Remove combined bold+italic: ***text*** → text
  cleaned = cleaned.replace(/\*\*\*([^*]+)\*\*\*/g, '$1');
  
  return cleaned;
}
