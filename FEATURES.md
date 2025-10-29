# ✨ Features Documentation

## Core Features

### 1. 🔍 Smart Search
- **Topic Search**: Enter any Grokipedia topic name
  - Example: "Elon Musk", "SpaceX", "Artificial Intelligence"
- **URL Search**: Paste direct Grokipedia URLs
  - Example: `https://grokipedia.com/page/Tesla`
- **Auto-completion**: Smart query handling
- **Loading States**: Visual feedback during scraping

### 2. 📚 Structured Navigation
- **Interactive Sidebar**: 
  - Hierarchical table of contents
  - Collapsible sections with arrow indicators
  - Click to jump to any section
  - Active section highlighting
- **Smooth Scrolling**: Animated transitions between sections
- **Nested Structure**: Support for multiple heading levels (H2-H6)

### 3. 🎨 Beautiful Reading Experience
- **Clean Typography**: Aeonik font for readability
- **Wiki-Style Layout**: 
  - Left sidebar for navigation
  - Wide content area for reading
  - Responsive on all devices
- **Markdown Support**:
  - Headings, paragraphs, lists
  - Code blocks with syntax highlighting
  - Tables, blockquotes
  - Internal and external links
  - Images (if present in source)

### 4. 🌓 Dark/Light Theme
- **Theme Toggle**: Switch between light and dark modes
- **System Preference**: Respects OS theme settings
- **Persistent**: Remembers your choice across sessions
- **Smooth Transition**: Animated theme switching

### 5. 📱 Responsive Design
- **Mobile-Friendly**: Works on phones, tablets, desktops
- **Adaptive Layout**: Sidebar collapses on small screens
- **Touch-Optimized**: Easy navigation on touch devices
- **Accessibility**: Keyboard navigation support

### 6. ⚡ Performance
- **Fast Loading**: Optimized Next.js build
- **Server-Side Rendering**: Quick initial page load
- **Efficient Parsing**: Smart markdown processing
- **Smooth Interactions**: React-optimized rendering

## Component Features

### SearchBar
```typescript
Features:
- Real-time input validation
- Loading indicator
- Error handling
- Submit on Enter key
- Disabled state during loading
```

### WikiSidebar
```typescript
Features:
- Sticky positioning
- Smooth scroll tracking
- Expand/collapse sections
- Active section highlighting
- Nested navigation support
- Scrollable content area
```

### WikiHeader
```typescript
Features:
- Page title display
- Last updated timestamp
- Source URL link
- External link button
- Responsive metadata layout
```

### WikiContent
```typescript
Features:
- Section-based rendering
- Scroll position tracking
- Smooth anchor navigation
- Nested subsection support
- Rich markdown formatting
```

### MarkdownRenderer
```typescript
Features:
- Full markdown support (GFM)
- Syntax highlighting for code
- Auto-linkify headings
- External link detection
- HTML sanitization
- Table support
```

## User Workflows

### Basic Search Flow
```
1. User enters topic → 2. System calls Firecrawl
                     ↓
3. Markdown returned ← 4. Parser processes content
                     ↓
5. UI renders result → 6. User navigates/reads
```

### Navigation Flow
```
1. Click TOC item → 2. Smooth scroll to section
                  ↓
3. Section highlighted → 4. Sidebar updates active state
```

### Theme Toggle Flow
```
1. Click theme button → 2. Theme switches
                      ↓
3. Preference saved → 4. Applied across app
```

## Data Processing

### Markdown Parsing Pipeline
```
Raw Markdown
    ↓
Extract Title (first # heading)
    ↓
Parse Sections (## headings)
    ↓
Build Hierarchy (nested subsections)
    ↓
Generate Anchors (slugified titles)
    ↓
Create TOC (navigation tree)
    ↓
Structured JSON Output
```

### Section Structure
```typescript
Section {
  id: "unique-identifier"
  title: "Section Name"
  level: 2-6
  content: "markdown content"
  anchor: "section-name"
  subsections: Section[]
}
```

## Error Handling

### API Errors
- Invalid URL/topic
- Firecrawl API failures
- Network timeouts
- Rate limiting

### User Feedback
- Clear error messages
- Retry suggestions
- Fallback states
- Loading indicators

## Keyboard Shortcuts (Future)

```
Planned shortcuts:
- Ctrl/Cmd + K: Focus search
- Esc: Clear search
- ↑/↓: Navigate sections
- Ctrl/Cmd + D: Toggle theme
```

## Browser Support

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partial Support
- IE 11 (basic functionality)
- Older mobile browsers

## Accessibility Features

### Current
- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation
- Focus management
- Alt text support

### Planned
- Screen reader optimization
- High contrast mode
- Font size controls
- Skip navigation links

## API Features

### `/api/scrape` Endpoint

**Capabilities:**
- Accepts topic name or full URL
- Validates input
- Calls Firecrawl with proper headers
- Parses response into structured format
- Error handling with detailed messages

**Rate Limiting:**
- Depends on Firecrawl plan
- Recommended: Add caching layer

**Response Time:**
- Average: 2-5 seconds
- Depends on page complexity

## Configuration Options

### Environment Variables
```bash
FIRECRAWL_API_KEY=required      # Your Firecrawl API key
NEXT_PUBLIC_APP_NAME=optional   # Custom app name
```

### Tailwind Theme
```typescript
// Customize in tailwind.config.ts
colors, fonts, spacing, breakpoints
```

### Markdown Plugins
```typescript
// Add/remove in MarkdownRenderer.tsx
remarkPlugins: [remarkGfm, ...]
rehypePlugins: [rehypeRaw, rehypeHighlight, ...]
```

## Security Features

### Input Sanitization
- URL validation
- Topic name cleaning
- XSS prevention

### API Security
- Environment variable protection
- Server-side API calls only
- No client-side key exposure

### Content Security
- Markdown sanitization
- Safe HTML rendering
- External link warnings

## Performance Metrics

### Target Metrics
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- API Response: 2-5s
- Lighthouse Score: 90+

### Optimization Techniques
- Code splitting
- Image optimization (future)
- Lazy loading
- Efficient re-renders

## Future Feature Roadmap

### Phase 1 (Current)
- ✅ Basic scraping
- ✅ Structured navigation
- ✅ Markdown rendering
- ✅ Theme toggle

### Phase 2 (Next)
- ⏳ Full-text search
- ⏳ Page caching
- ⏳ User favorites
- ⏳ Export to PDF

### Phase 3 (Future)
- ⏳ AI chat integration
- ⏳ Multi-page linking
- ⏳ User annotations
- ⏳ Collaborative features

### Phase 4 (Advanced)
- ⏳ Offline mode (PWA)
- ⏳ Mobile app
- ⏳ Browser extension
- ⏳ API for developers

---

**Status Legend:**
- ✅ Implemented
- ⏳ Planned
- 🚧 In Progress
- ❌ Deprecated

---

Last Updated: October 28, 2025

