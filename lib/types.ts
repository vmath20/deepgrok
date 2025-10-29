export interface WikiData {
  title: string;
  sections: WikiSection[];
  rawMarkdown: string;
  tableOfContents: TocItem[];
  metadata?: {
    author?: string;
    lastUpdated?: string;
    source?: string;
  };
}

export interface WikiSection {
  id: string;
  title: string;
  level: number;
  content: string;
  anchor: string;
  subsections: WikiSection[];
}

export interface TocItem {
  title: string;
  anchor: string;
  level: number;
  children: TocItem[];
}

export interface SearchResult {
  section: WikiSection;
  matches: string[];
  score: number;
}

