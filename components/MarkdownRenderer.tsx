'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';
import { HeaderWithLink } from '@/components/HeaderWithLink';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  baseUrl?: string;
}

export function MarkdownRenderer({ content, className, baseUrl }: MarkdownRendererProps) {
  // Debug: check if HTML is in content
  const hasSuperscripts = content.includes('<sup>');
  const supCount = (content.match(/<sup>/g) || []).length;
  
  if (hasSuperscripts) {
    console.log('🎨 MarkdownRenderer received content with', supCount, 'superscripts');
  }
  
  return (
    <div className={cn('wiki-content prose prose-slate dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => {
            const id = slugify(props.children?.toString() || '');
            return <HeaderWithLink level={1} id={id} baseUrl={baseUrl}>{props.children}</HeaderWithLink>;
          },
          h2: ({ node, ...props }) => {
            const id = slugify(props.children?.toString() || '');
            return <HeaderWithLink level={2} id={id} baseUrl={baseUrl}>{props.children}</HeaderWithLink>;
          },
          h3: ({ node, ...props }) => {
            const id = slugify(props.children?.toString() || '');
            return <HeaderWithLink level={3} id={id} baseUrl={baseUrl}>{props.children}</HeaderWithLink>;
          },
          h4: ({ node, ...props }) => {
            const id = slugify(props.children?.toString() || '');
            return <HeaderWithLink level={4} id={id} baseUrl={baseUrl}>{props.children}</HeaderWithLink>;
          },
          a: ({ node, ...props }) => {
            const href = props.href || '';
            const isExternal = href.startsWith('http');
            return (
              <a
                {...props}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

