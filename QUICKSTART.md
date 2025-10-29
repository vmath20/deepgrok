# 🚀 Quick Start Guide

Get MindGrokipedia running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- A Firecrawl API key ([sign up here](https://firecrawl.dev/))

## Installation Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up Environment
```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your Firecrawl API key
# FIRECRAWL_API_KEY=fc-your-key-here
```

### 3️⃣ Run Development Server
```bash
npm run dev
```

### 4️⃣ Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

### 5️⃣ Try It Out!
Search for any of these topics:
- `Elon Musk`
- `SpaceX`
- `Tesla`
- `Artificial Intelligence`

---

## 🎯 Usage Examples

### Search by Topic Name
```
Type: "Quantum Computing"
→ Auto-generates URL: grokipedia.com/page/Quantum_Computing
```

### Search by Full URL
```
Paste: https://grokipedia.com/page/Mars
→ Directly scrapes that page
```

### Navigate Content
1. Use the **sidebar** to browse sections
2. Click any section to **jump** to it
3. **Expand/collapse** subsections with arrows
4. Toggle **dark/light** theme in top-right

---

## 📂 Project Structure

```
mindgrokipedia/
├── app/                 # Next.js pages
│   ├── page.tsx        # Main app
│   └── api/scrape/     # Firecrawl endpoint
├── components/         # UI components
│   ├── SearchBar.tsx
│   ├── WikiSidebar.tsx
│   ├── WikiContent.tsx
│   └── ...
├── lib/                # Utilities
│   ├── markdown-parser.ts
│   └── types.ts
└── public/             # Static files
```

---

## 🔧 Common Issues

### "API key not configured"
**Solution:** Make sure `.env.local` exists with your key:
```bash
FIRECRAWL_API_KEY=your_key_here
```
Then restart the dev server.

### "Failed to scrape"
**Possible causes:**
- Page doesn't exist on Grokipedia
- API key is invalid
- Network issue

**Solution:** 
- Try a different topic
- Check API key in Firecrawl dashboard
- Verify internet connection

### Page is blank
**Solution:**
- Open browser console (F12)
- Check for errors
- Verify dev server is running

---

## 🎨 Customization

### Change Theme Colors
Edit `app/globals.css`:
```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
}
```

### Change Font
Edit `app/layout.tsx`:
```tsx
<link href="your-font-url" rel="stylesheet" />
```

### Add New Features
- Check `FEATURES.md` for roadmap
- Explore `components/` to add UI
- Extend `lib/` for utilities

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `README.md` | Full project overview |
| `SETUP.md` | Detailed setup guide |
| `FEATURES.md` | Feature documentation |
| `ARCHITECTURE.md` | Technical architecture |

---

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Don't forget to add `FIRECRAWL_API_KEY` in Vercel's environment variables!

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

---

## 🆘 Need Help?

- **Documentation**: Check the docs in this repo
- **Issues**: Open an issue on GitHub
- **Firecrawl**: Visit [firecrawl.dev/docs](https://firecrawl.dev/docs)
- **Next.js**: Visit [nextjs.org/docs](https://nextjs.org/docs)

---

## ✅ Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Tested on multiple topics
- [ ] Responsive design verified
- [ ] Error handling tested
- [ ] API rate limits understood
- [ ] Deployment platform chosen
- [ ] Domain configured (if needed)

---

**🎉 You're all set!** Start exploring Grokipedia with enhanced navigation.

---

Last Updated: October 28, 2025

