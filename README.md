# DeepGrok
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/vmath20/deepgrok)

DeepGrok is an enhanced reader for Grokipedia, designed to provide a superior user experience with intelligent search, structured content, AI-powered interactions, and visual exploration tools. It scrapes Grokipedia pages, cleans and formats the content, and presents it in a clean, navigable interface.

## Features

- **Intelligent Search**: Instantly search for any Grokipedia topic or paste a direct URL to start reading.
- **Structured Content**: Automatically parses articles into a clean layout with a sticky table of contents for easy navigation.
- **Interactive Mindmaps**: Generate and explore a hierarchical mindmap of any article to get a high-level visual overview of its structure and key topics.
- **AI-Powered Chat**: Ask questions about the page content and get concise, accurate answers from an AI assistant that has the article's full context.
- **Advanced Reference Formatting**: Automatically identifies, formats, and links all citations, providing hover-over tooltips and a cleanly organized references section.
- **Export Options**: Download any article as a clean, formatted PDF or copy the raw, cleaned markdown to your clipboard.
- **Performance Caching**: Utilizes Supabase to cache scraped pages and generated mindmaps, ensuring near-instant load times for subsequent visits.
- **Modern Dark UI**: A sleek, responsive, and always-dark interface built with Next.js and Tailwind CSS for a comfortable reading experience.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **Scraping**: [Firecrawl](https://firecrawl.dev/)
- **AI & LLMs**: [OpenRouter](https://openrouter.ai/) (using `meta-llama/llama-3.2-3b-instruct:free`)
- **Database & Caching**: [Supabase](https://supabase.io/)
- **Markdown Processing**: [marked](https://marked.js.org/), [remark](https://github.com/remarkjs/remark), [rehype](https://github.com/rehypejs/rehype)
- **Mindmap Visualization**: [Markmap](https://markmap.js.org/)
- **PDF Export**: [jsPDF](https://github.com/parallax/jsPDF)

## How It Works

1.  A user enters a Grokipedia topic or URL into the search bar.
2.  The Next.js API route first checks for a cached version of the page in the Supabase database. If a recent, valid cache entry is found, it's returned immediately.
3.  If no cache exists, the API calls the **Firecrawl** service to scrape the live Grokipedia page and retrieve its content as markdown.
4.  The raw markdown is passed through a series of cleaners and formatters to remove UI elements, fix paragraph breaks, and structure references.
5.  Citations within the text are processed to become interactive superscript links with hover tooltips, and a structured "References" section is generated at the end.
6.  The cleaned and processed content is cached in **Supabase** to speed up future requests for the same page.
7.  The structured data is sent to the frontend, where it's rendered into a readable format with a navigable sidebar.
8.  For interactive features:
    -   **Mindmap**: The article's markdown is sent to **OpenRouter** to generate a hierarchical markdown structure, which is then rendered visually using Markmap.
    -   **Chat**: The article's content is provided as context to an **OpenRouter** model, allowing the user to have a conversation about the document.

## Local Development

To run this project locally, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/vmath20/deepgrok.git
    cd deepgrok
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**

    Create a `.env.local` file in the root of the project and add the following environment variables. You will need API keys from Firecrawl, OpenRouter, and Supabase.

    ```env
    # Firecrawl API Key for scraping
    FIRECRAWL_API_KEY="your_firecrawl_api_key"

    # OpenRouter API Key for AI chat and mindmap generation
    OPENROUTER_API_KEY="your_openrouter_api_key"

    # Supabase credentials for caching and analytics
    NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

    # (Optional) The public URL of your deployed app
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Set Up Supabase Database**

    -   Log in to your Supabase account and create a new project.
    -   Navigate to the **SQL Editor**.
    -   Run the SQL commands from the following files in your project to create the necessary tables and policies:
        - `supabase-analytics.sql`: For visitor tracking.
        - `supabase-mindmap.sql`: For caching generated mindmaps.
        - `supabase-fix.sql`: A helper script for RLS policies (run if you still have issues after the next step).
    - You will also need a `cached_pages` table that the application uses for page caching. You can create it with the following schema:
        ```sql
        CREATE TABLE cached_pages (
          id BIGSERIAL PRIMARY KEY,
          url TEXT UNIQUE NOT NULL,
          title TEXT,
          markdown TEXT NOT NULL,
          metadata JSONB,
          cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        -- NOTE: Ensure you add appropriate RLS policies similar to the other SQL files.
        ```


5.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application exposes several API endpoints for its core functionalities:

-   `POST /api/scrape`: Accepts a `topic` or `url` to scrape a Grokipedia page. It handles caching, cleaning, and parsing of the content.
-   `POST /api/chat`: A streaming endpoint that takes chat `messages` and page `context` to facilitate a conversation with an AI model about the page content.
-   `POST /api/mindmap`: Accepts a `url` and `markdown` content to generate a hierarchical mindmap structure. It uses caching to avoid re-generating mindmaps for the same page.
-   `GET /api/analytics`: Retrieves visitor analytics from the Supabase database.
