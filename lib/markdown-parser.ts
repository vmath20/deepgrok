import { marked } from 'marked';

export interface WikiSection {
  id: string;
  title: string;
  level: number;
  content: string;
  anchor: string;
  subsections: WikiSection[];
}

export interface ParsedWiki {
  title: string;
  sections: WikiSection[];
  rawMarkdown: string;
  tableOfContents: TocItem[];
}

export interface TocItem {
  title: string;
  anchor: string;
  level: number;
  children: TocItem[];
}

/**
 * Parses Firecrawl markdown output into structured JSON
 */
export function parseMarkdown(markdown: string): ParsedWiki {
  const lines = markdown.split('\n');
  const sections: WikiSection[] = [];
  const tocItems: TocItem[] = [];
  let title = '';
  let currentSection: WikiSection | null = null;
  let contentBuffer: string[] = [];

  // Extract title (first # heading)
  for (const line of lines) {
    if (line.startsWith('# ')) {
      title = line.replace(/^#\s+/, '').trim();
      break;
    }
  }

  // Parse sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if it's a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      // Save previous section's content
      if (currentSection) {
        currentSection.content = contentBuffer.join('\n').trim();
        contentBuffer = [];
      }

      const level = headingMatch[1].length;
      const headingTitle = headingMatch[2].trim();
      const anchor = slugify(headingTitle);

      const section: WikiSection = {
        id: `section-${anchor}-${Date.now()}-${Math.random()}`,
        title: headingTitle,
        level,
        content: '',
        anchor,
        subsections: [],
      };

      // Build hierarchy
      if (level === 1) {
        // Skip the main title (already extracted)
        continue;
      } else if (level === 2) {
        sections.push(section);
        currentSection = section;
      } else if (level > 2 && currentSection) {
        // Add as subsection to the current section
        addSubsection(currentSection, section, level);
      }

      // Build TOC
      addToToc(tocItems, {
        title: headingTitle,
        anchor,
        level,
        children: [],
      });
    } else if (currentSection) {
      // Add content to current section
      contentBuffer.push(line);
    }
  }

  // Save last section's content
  if (currentSection) {
    currentSection.content = contentBuffer.join('\n').trim();
  }

  return {
    title,
    sections,
    rawMarkdown: markdown,
    tableOfContents: tocItems,
  };
}

function addSubsection(parent: WikiSection, child: WikiSection, targetLevel: number) {
  if (parent.level === targetLevel - 1) {
    parent.subsections.push(child);
  } else if (parent.subsections.length > 0) {
    const lastSubsection = parent.subsections[parent.subsections.length - 1];
    addSubsection(lastSubsection, child, targetLevel);
  } else {
    parent.subsections.push(child);
  }
}

function addToToc(tocItems: TocItem[], item: TocItem) {
  if (item.level === 2) {
    tocItems.push(item);
  } else if (tocItems.length > 0) {
    const lastItem = tocItems[tocItems.length - 1];
    addToTocRecursive(lastItem, item);
  }
}

function addToTocRecursive(parent: TocItem, child: TocItem) {
  if (parent.level === child.level - 1) {
    parent.children.push(child);
  } else if (parent.children.length > 0) {
    const lastChild = parent.children[parent.children.length - 1];
    addToTocRecursive(lastChild, child);
  } else {
    parent.children.push(child);
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract TOC from markdown (lines starting with - [Title](#anchor))
 */
export function extractTocFromMarkdown(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const tocItems: TocItem[] = [];
  
  for (const line of lines) {
    const match = line.match(/^(\s*)-\s+\[(.+?)\]\(#(.+?)\)/);
    if (match) {
      const indentLevel = Math.floor((match[1]?.length || 0) / 2) + 2; // Convert indent to heading level
      const title = match[2];
      const anchor = match[3];
      
      tocItems.push({
        title,
        anchor,
        level: indentLevel,
        children: [],
      });
    }
  }
  
  return tocItems;
}

