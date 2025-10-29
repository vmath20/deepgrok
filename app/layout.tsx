import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepGrok",
  description: "Explore Grokipedia pages with enhanced navigation, search, and structure powered by Firecrawl",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Always dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('dark');`,
          }}
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=aeonik@400,700&display=swap"
          rel="stylesheet"
        />
        {/* Tailwind CDN fallback to ensure styles render if local PostCSS fails */}
        <script
          dangerouslySetInnerHTML={{
            __html: `tailwind = { config: { darkMode: 'class', theme: { extend: { colors: { border: 'hsl(var(--border))', input: 'hsl(var(--input))', ring: 'hsl(var(--ring))', background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))', primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' }, secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' }, destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' }, muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' }, accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' }, popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' }, card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' } }, fontFamily: { sans: ['Aeonik', 'sans-serif'] } } } }`,
          }}
        />
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="theme-color" content="#0b0f19" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

