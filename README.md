# 🧠 MindGrokipedia - DeepWiki for Grokipedia

A powerful platform to explore Grokipedia pages with enhanced navigation, search, and structure. Built with Next.js, Firecrawl, and modern web technologies.

![MindGrokipedia](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- **Smart Scraping**: Uses Firecrawl API to extract structured markdown from Grokipedia pages
- **Interactive Navigation**: Collapsible sidebar with hierarchical section browsing
- **Clean Reading**: Wiki-style content renderer with proper formatting
- **Search**: Enter topic names or paste full URLs
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: Automatic theme support (coming soon)

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Firecrawl API key ([Get one here](https://firecrawl.dev/))

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mindgrokipedia.git
cd mindgrokipedia
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firecrawl API key:
```
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
User Input → Firecrawl API → Markdown Parser → Section Indexer → Frontend Renderer
```

### Tech Stack

| Purpose | Technology |
|---------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Scraping** | Firecrawl API |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Markdown** | React Markdown + Remark/Rehype |
| **Language** | TypeScript |

### Project Structure

```
mindgrokipedia/
├── app/
│   ├── api/
│   │   └── scrape/
│   │       └── route.ts          # Firecrawl API integration
│   ├── layout.tsx                # Root layout with font config
│   ├── page.tsx                  # Main page with state management
│   └── globals.css               # Global styles and themes
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── SearchBar.tsx             # Search input component
│   ├── WikiSidebar.tsx           # Navigation sidebar
│   ├── WikiHeader.tsx            # Page header with metadata
│   ├── WikiContent.tsx           # Content renderer
│   └── MarkdownRenderer.tsx      # Markdown to HTML converter
├── lib/
│   ├── markdown-parser.ts        # Markdown parsing logic
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Utility functions
└── public/                       # Static assets
```

## 🎨 Usage

### Search for a Topic
```
Enter: "Elon Musk"
```

### Paste a URL
```
https://grokipedia.com/page/SpaceX
```

### Navigate Sections
- Click on any section in the sidebar to jump to it
- Expand/collapse subsections with the arrow icons
- Active section is highlighted as you scroll

## 🔌 API Endpoints

### POST `/api/scrape`

Scrapes a Grokipedia page and returns structured data.

**Request Body:**
```json
{
  "topic": "Elon Musk"  // OR
  "url": "https://grokipedia.com/page/Elon_Musk"
}
```

**Response:**
```json
{
  "title": "Elon Musk",
  "sections": [...],
  "tableOfContents": [...],
  "rawMarkdown": "...",
  "metadata": {
    "source": "https://...",
    "lastUpdated": "2025-10-28T..."
  }
}
```

## 🎯 Roadmap

- [ ] Full-text search within content
- [ ] "Chat with Page" feature using OpenAI embeddings
- [ ] Offline caching with Supabase
- [ ] Multi-page cross-linking
- [ ] User annotations and bookmarks
- [ ] Export to PDF/Markdown
- [ ] Dark/Light/System theme toggle

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- [Firecrawl](https://firecrawl.dev/) for the amazing scraping API
- [Grokipedia](https://grokipedia.com/) for the knowledge base
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Next.js](https://nextjs.org/) for the awesome framework

---

Built with ❤️ for knowledge explorers

