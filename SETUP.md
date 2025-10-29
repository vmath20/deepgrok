# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Step 2: Get Your Firecrawl API Key

1. Visit [https://firecrawl.dev/](https://firecrawl.dev/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

## Step 3: Configure Environment

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Add your Firecrawl API key:

```
FIRECRAWL_API_KEY=fc-your-api-key-here
```

## Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test It Out

Try searching for:
- `Elon Musk`
- `SpaceX`
- `Tesla`
- Or paste any Grokipedia URL

---

## 🐛 Troubleshooting

### "Firecrawl API key not configured"
- Make sure you created `.env.local` file
- Verify your API key is correct
- Restart the development server after adding the key

### "Failed to scrape the page"
- Check if the Grokipedia URL is valid
- Verify your Firecrawl API key has credits
- Check the browser console for detailed error messages

### Page loads but no content shows
- The Grokipedia page might not exist
- Try a different topic or URL
- Check the Network tab in browser DevTools

### Styling looks broken
- Make sure Tailwind CSS is properly installed
- Run `npm install` again
- Clear browser cache and restart dev server

---

## 📚 Example Topics to Try

1. **Technology**
   - `Artificial Intelligence`
   - `Quantum Computing`
   - `SpaceX`

2. **People**
   - `Elon Musk`
   - `Steve Jobs`
   - `Albert Einstein`

3. **Science**
   - `Black Holes`
   - `DNA`
   - `Mars`

---

## 🔧 Advanced Configuration

### Custom Firecrawl Options

Edit `app/api/scrape/route.ts` to customize scraping:

```typescript
body: JSON.stringify({
  url: targetUrl,
  formats: ['markdown'],
  // Add more options:
  // timeout: 30000,
  // waitFor: 5000,
}),
```

### Adjust Theme Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... more color variables */
}
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Make sure to add your `FIRECRAWL_API_KEY` in Vercel's environment variables.

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod
```

Add environment variables in Netlify's dashboard.

---

## 📖 Next Steps

- Explore the [README.md](README.md) for full documentation
- Check out the [API documentation](app/api/scrape/route.ts)
- Customize components in the `components/` directory
- Extend functionality in `lib/` utilities

---

**Need help?** Open an issue on GitHub or check the documentation.

