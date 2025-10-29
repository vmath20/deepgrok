# 🏗️ Architecture Documentation

## System Overview

MindGrokipedia is built as a modern Next.js application that fetches, parses, and displays Grokipedia content in an enhanced, structured format.

## Data Flow

```
┌─────────────┐
│    User     │
│   Input     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│        Frontend (Next.js App)           │
│  ┌─────────────────────────────────┐   │
│  │      SearchBar Component        │   │
│  └───────────┬─────────────────────┘   │
│              │                          │
│              ▼                          │
│  ┌─────────────────────────────────┐   │
│  │    API Route: /api/scrape       │   │
│  └───────────┬─────────────────────┘   │
└──────────────┼─────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│      External: Firecrawl API             │
│  (Scrapes & Returns Markdown)            │
└───────────────┬──────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────┐
│      Markdown Parser (lib/parser)         │
│  • Extracts title & TOC                   │
│  • Parses sections & hierarchy            │
│  • Generates anchor links                 │
└───────────────┬───────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────┐
│         Structured JSON Data              │
│  {                                        │
│    title, sections, toc, metadata         │
│  }                                        │
└───────────────┬───────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────┐
│      React Components Render              │
│  • WikiSidebar (Navigation)               │
│  • WikiHeader (Metadata)                  │
│  • WikiContent (Body)                     │
│  • MarkdownRenderer (Content)             │
└───────────────────────────────────────────┘
```

## Component Hierarchy

```
app/page.tsx (Main Container)
├── SearchBar
│   └── Input + Button
├── WikiSidebar
│   ├── TOC Navigation Tree
│   └── TocItemComponent (Recursive)
├── WikiHeader
│   ├── Title
│   └── Metadata (source, date)
└── WikiContent
    └── MarkdownRenderer
        └── React-Markdown
            ├── Remark (GFM)
            └── Rehype (Raw HTML, Syntax Highlighting)
```

## Key Technologies

### Frontend
- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Component library
- **React Markdown** - Markdown rendering
- **Lucide React** - Icons

### Backend/API
- **Next.js API Routes** - Serverless functions
- **Firecrawl API** - Web scraping service

### Utilities
- **Marked** - Markdown parsing
- **Remark/Rehype** - Markdown processing plugins

## File Structure

```
mindgrokipedia/
│
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts        # API endpoint for Firecrawl
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (main app)
│   └── globals.css             # Global styles
│
├── components/                 # React components
│   ├── ui/                     # Shadcn UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── scroll-area.tsx
│   ├── SearchBar.tsx           # Search input
│   ├── WikiSidebar.tsx         # TOC navigation
│   ├── WikiHeader.tsx          # Page header
│   ├── WikiContent.tsx         # Content area
│   ├── MarkdownRenderer.tsx    # Markdown display
│   └── ThemeToggle.tsx         # Dark/light mode
│
├── lib/                        # Utility functions
│   ├── markdown-parser.ts      # Parse MD to JSON
│   ├── types.ts                # TypeScript interfaces
│   ├── utils.ts                # Helper functions
│   ├── search.ts               # Search utilities
│   └── demo-data.ts            # Test data
│
├── public/                     # Static assets
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.mjs
    └── .env.local
```

## API Design

### POST /api/scrape

**Input:**
```typescript
{
  topic?: string;     // e.g., "Elon Musk"
  url?: string;       // e.g., "https://grokipedia.com/page/..."
}
```

**Output:**
```typescript
{
  title: string;
  sections: WikiSection[];
  tableOfContents: TocItem[];
  rawMarkdown: string;
  metadata: {
    source: string;
    lastUpdated: string;
    scraped: boolean;
  };
}
```

**Error Response:**
```typescript
{
  error: string;
  details?: any;
}
```

## Type Definitions

### WikiSection
```typescript
interface WikiSection {
  id: string;           // Unique identifier
  title: string;        // Section heading
  level: number;        // Heading level (1-6)
  content: string;      // Markdown content
  anchor: string;       // URL fragment (#section)
  subsections: WikiSection[];  // Nested sections
}
```

### TocItem
```typescript
interface TocItem {
  title: string;
  anchor: string;
  level: number;
  children: TocItem[];
}
```

## State Management

Currently uses React's built-in `useState` for local state:

- `wikiData` - Parsed wiki content
- `isLoading` - Loading state
- `error` - Error messages
- `activeSection` - Current scroll position

**Future Enhancement:** Consider Redux/Zustand for:
- Caching scraped pages
- User preferences
- Search history

## Styling System

### Tailwind CSS Classes
- Uses utility-first approach
- Custom design tokens in `tailwind.config.ts`
- Dark mode support via `dark:` prefix

### CSS Variables
```css
--primary, --secondary, --accent, --muted
--background, --foreground, --border
```

### Component Variants
Shadcn components use `class-variance-authority` for variants:
```typescript
variant: "default" | "outline" | "ghost" | "destructive"
size: "sm" | "default" | "lg" | "icon"
```

## Performance Considerations

1. **Code Splitting**: Next.js automatically splits code by route
2. **Server Components**: Static content rendered on server
3. **Client Components**: Interactive features marked with `'use client'`
4. **Lazy Loading**: Images and heavy components can be lazy loaded
5. **Caching**: Consider adding Redis/Supabase for cached pages

## Security

1. **API Key Protection**: Firecrawl key stored in `.env.local`
2. **Input Validation**: URL and topic validation in API route
3. **XSS Prevention**: React-Markdown sanitizes HTML by default
4. **Rate Limiting**: Consider adding for production

## Deployment

### Environment Variables Required
```
FIRECRAWL_API_KEY=your_key_here
```

### Build Command
```bash
npm run build
```

### Hosting Options
- **Vercel** (Recommended) - Optimized for Next.js
- **Netlify** - Good alternative
- **Railway** - For Docker deployments
- **Self-hosted** - Use Node.js server

## Testing Strategy (Future)

```
├── Unit Tests
│   ├── Markdown parser
│   ├── Utility functions
│   └── Component logic
│
├── Integration Tests
│   ├── API routes
│   └── Component interactions
│
└── E2E Tests
    ├── Search flow
    ├── Navigation
    └── Theme switching
```

## Future Enhancements

1. **Backend**
   - Supabase integration for caching
   - Full-text search with PostgreSQL
   - User authentication

2. **Frontend**
   - Progressive Web App (PWA)
   - Offline mode
   - Print/PDF export

3. **Features**
   - AI chat with OpenAI embeddings
   - Multi-page cross-linking
   - User annotations
   - Bookmarks/favorites
   - Advanced search filters

4. **Performance**
   - Service worker caching
   - Image optimization
   - Incremental static regeneration

---

Last Updated: October 28, 2025

