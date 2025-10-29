import type { WikiSection, SearchResult } from './types';

/**
 * Simple in-memory search across wiki sections
 */
export function searchWikiSections(
  sections: WikiSection[],
  query: string
): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  function searchSection(section: WikiSection) {
    const titleMatch = section.title.toLowerCase().includes(lowerQuery);
    const contentMatch = section.content.toLowerCase().includes(lowerQuery);

    if (titleMatch || contentMatch) {
      const matches: string[] = [];
      
      if (titleMatch) {
        matches.push(section.title);
      }

      if (contentMatch) {
        // Extract matching sentences
        const sentences = section.content.split(/[.!?]+/);
        const matchingSentences = sentences
          .filter(s => s.toLowerCase().includes(lowerQuery))
          .map(s => s.trim())
          .slice(0, 2); // Limit to 2 matches per section
        
        matches.push(...matchingSentences);
      }

      results.push({
        section,
        matches,
        score: titleMatch ? 10 : 5, // Title matches are more relevant
      });
    }

    // Recursively search subsections
    section.subsections.forEach(searchSection);
  }

  sections.forEach(searchSection);

  // Sort by score (descending)
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Highlight search query in text
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

