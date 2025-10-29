/**
 * Demo data for testing the app without Firecrawl API
 * Uncomment the usage in app/page.tsx to use this data
 */

export const demoWikiData = {
  title: "Elon Musk",
  rawMarkdown: `# Elon Musk

Elon Reeve Musk is a businessman and investor known for his key roles in the space company SpaceX and the automotive company Tesla, Inc.

## Early Life and Education

### Childhood and Family Background

Elon Musk was born on June 28, 1971, in Pretoria, South Africa, to Maye Musk (née Haldeman), a model and dietitian, and Errol Musk, an electromechanical engineer. He has a younger brother, Kimbal, and a younger sister, Tosca.

### Move to North America and Education

In June 1989, Musk emigrated to Canada and enrolled at Queen's University in Kingston, Ontario. In 1992, he transferred to the University of Pennsylvania, where he earned bachelor's degrees in economics and physics.

## Business Career

### PayPal and Early Ventures

Musk co-founded X.com, an online payment company, in 1999, which later merged with Confinity and became PayPal. eBay acquired PayPal for $1.5 billion in 2002.

### SpaceX

In 2002, Musk founded Space Exploration Technologies Corp. (SpaceX) with the goal of reducing space transportation costs and enabling the colonization of Mars. SpaceX has developed the Falcon and Starship launch vehicles.

### Tesla Motors

Musk joined Tesla Motors (now Tesla, Inc.) in 2004, leading its initial round of investment. He has served as CEO since 2008. Tesla produces electric vehicles, battery energy storage, and solar panels.

### Other Ventures

Musk has been involved in various other ventures including:
- **Neuralink**: A neurotechnology company
- **The Boring Company**: Infrastructure and tunnel construction
- **Twitter/X**: Social media platform acquired in 2022

## Personal Life

Musk has been married three times and has ten children. He is known for his active presence on social media and his ambitious visions for the future of humanity.

## Legacy and Impact

Elon Musk is considered one of the most influential entrepreneurs of the 21st century, known for his work in electric vehicles, space exploration, and renewable energy.`,
  sections: [
    {
      id: "section-early-life",
      title: "Early Life and Education",
      level: 2,
      content: "Information about Musk's early years and education.",
      anchor: "early-life-and-education",
      subsections: [
        {
          id: "section-childhood",
          title: "Childhood and Family Background",
          level: 3,
          content: "Elon Musk was born on June 28, 1971, in Pretoria, South Africa, to Maye Musk (née Haldeman), a model and dietitian, and Errol Musk, an electromechanical engineer.",
          anchor: "childhood-and-family-background",
          subsections: [],
        },
        {
          id: "section-move",
          title: "Move to North America and Education",
          level: 3,
          content: "In June 1989, Musk emigrated to Canada and enrolled at Queen's University in Kingston, Ontario.",
          anchor: "move-to-north-america-and-education",
          subsections: [],
        },
      ],
    },
    {
      id: "section-business",
      title: "Business Career",
      level: 2,
      content: "Overview of Musk's various business ventures.",
      anchor: "business-career",
      subsections: [
        {
          id: "section-paypal",
          title: "PayPal and Early Ventures",
          level: 3,
          content: "Musk co-founded X.com, an online payment company, in 1999.",
          anchor: "paypal-and-early-ventures",
          subsections: [],
        },
        {
          id: "section-spacex",
          title: "SpaceX",
          level: 3,
          content: "In 2002, Musk founded Space Exploration Technologies Corp. (SpaceX).",
          anchor: "spacex",
          subsections: [],
        },
        {
          id: "section-tesla",
          title: "Tesla Motors",
          level: 3,
          content: "Musk joined Tesla Motors (now Tesla, Inc.) in 2004.",
          anchor: "tesla-motors",
          subsections: [],
        },
      ],
    },
  ],
  tableOfContents: [
    {
      title: "Early Life and Education",
      anchor: "early-life-and-education",
      level: 2,
      children: [
        {
          title: "Childhood and Family Background",
          anchor: "childhood-and-family-background",
          level: 3,
          children: [],
        },
        {
          title: "Move to North America and Education",
          anchor: "move-to-north-america-and-education",
          level: 3,
          children: [],
        },
      ],
    },
    {
      title: "Business Career",
      anchor: "business-career",
      level: 2,
      children: [
        {
          title: "PayPal and Early Ventures",
          anchor: "paypal-and-early-ventures",
          level: 3,
          children: [],
        },
        {
          title: "SpaceX",
          anchor: "spacex",
          level: 3,
          children: [],
        },
        {
          title: "Tesla Motors",
          anchor: "tesla-motors",
          level: 3,
          children: [],
        },
      ],
    },
  ],
  metadata: {
    source: "Demo Data",
    lastUpdated: new Date().toISOString(),
  },
};

