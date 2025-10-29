import jsPDF from 'jspdf';

export interface ExportOptions {
  title: string;
  url?: string;
}

/**
 * Export the current wiki page to PDF
 */
export async function exportToPDF(options: ExportOptions): Promise<void> {
  try {
    console.log('📄 Starting PDF export...');
    
    const contentElement = document.querySelector('.wiki-content');
    if (!contentElement) {
      throw new Error('Content not found');
    }

    const loadingToast = showExportProgress('Generating PDF...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    let yPosition = margin;

    // Add DeepGrok logo image
    try {
      const logoImg = await loadImage('/logoWhite.png');
      const logoHeight = 8; // Height in mm
      const logoWidth = logoHeight * (logoImg.width / logoImg.height); // Maintain aspect ratio
      pdf.addImage(logoImg, 'PNG', margin, yPosition, logoWidth, logoHeight);
      yPosition += logoHeight + 5;
    } catch (err) {
      // Fallback to text if logo fails to load
      console.warn('Logo failed to load, using text fallback');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(150, 150, 150);
      pdf.text('DeepGrok', margin, yPosition);
      yPosition += 8;
    }

    // Add separator
    pdf.setDrawColor(220, 220, 220);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const titleLines = pdf.splitTextToSize(options.title, contentWidth);
    pdf.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 7 + 5;

    // Add source URL if available
    if (options.url) {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(options.url, margin, yPosition);
      yPosition += 6;
      pdf.setTextColor(0, 0, 0);
    }

    yPosition += 5;

    // Process content
    const content = parseContentForPDF(contentElement as HTMLElement);
    let inReferencesSection = false;
    
    for (let i = 0; i < content.length; i++) {
      const block = content[i];
      
      // Check if this is the start of references
      if (block.type === 'reference' && !inReferencesSection) {
        inReferencesSection = true;
        
        // Add References heading
        if (yPosition + 15 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        yPosition += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(0, 0, 0);
        pdf.text('References', margin, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
      }
      
      // Check if we need a new page
      const estimatedHeight = block.type === 'heading' ? 12 : block.type === 'paragraph' ? 8 : 6;
      if (yPosition + estimatedHeight > pageHeight - margin - 10) {
        pdf.addPage();
        yPosition = margin;
      }

      if (block.type === 'heading') {
        const level = block.level || 2;
        yPosition += level === 2 ? 5 : 3;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(level === 2 ? 16 : level === 3 ? 14 : 12);
        pdf.setTextColor(0, 0, 0);
        
        const lines = pdf.splitTextToSize(block.text, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * (level === 2 ? 6 : 5) + 2;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
      } else if (block.type === 'paragraph') {
        pdf.setTextColor(0, 0, 0);
        
        // Handle text with citations
        const segments = parseTextWithCitations(block.text);
        let currentLine = '';
        let xPos = margin;
        const lineHeight = 5;
        
        for (let j = 0; j < segments.length; j++) {
          const segment = segments[j];
          
          if (segment.isCitation) {
            // Flush current line if we have text
            if (currentLine) {
              const lines = pdf.splitTextToSize(currentLine, contentWidth);
              for (const line of lines) {
                if (yPosition > pageHeight - margin - 10) {
                  pdf.addPage();
                  yPosition = margin;
                }
                pdf.text(line, margin, yPosition);
                yPosition += lineHeight;
              }
              currentLine = '';
              xPos = pdf.getTextWidth(lines[lines.length - 1] || '');
            }
            
            // Add superscript citation
            const currentY = yPosition - lineHeight; // Go back to last line
            pdf.setFontSize(7);
            pdf.setTextColor(170, 170, 170);
            
            // Create internal link to reference
            const linkText = `[${segment.text}]`;
            pdf.link(xPos + margin, currentY - 3, pdf.getTextWidth(linkText), 4, { 
              pageNumber: getPDFPageNumber(pdf, `ref-${segment.text}`)
            });
            pdf.text(linkText, xPos + margin, currentY - 1.5);
            
            xPos += pdf.getTextWidth(linkText);
            
            pdf.setFontSize(11);
            pdf.setTextColor(0, 0, 0);
          } else {
            currentLine += segment.text;
          }
        }
        
        // Flush remaining text
        if (currentLine) {
          const lines = pdf.splitTextToSize(currentLine.trim(), contentWidth);
          for (const line of lines) {
            if (yPosition > pageHeight - margin - 10) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.text(line, margin, yPosition);
            yPosition += lineHeight;
          }
        }
        
        yPosition += 4; // Increased paragraph spacing
      } else if (block.type === 'list-item') {
        pdf.setTextColor(0, 0, 0);
        const bullet = '• ';
        const lines = pdf.splitTextToSize(bullet + block.text, contentWidth - 5);
        
        for (const line of lines) {
          if (yPosition > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin + 5, yPosition);
          yPosition += 5;
        }
      } else if (block.type === 'reference') {
        if (yPosition > pageHeight - margin - 15) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Mark anchor point for this reference
        const refAnchor = `ref-${block.number}`;
        (pdf as any).internal.write(`/Name (${refAnchor})`);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        
        // Number
        pdf.text(`${block.number}.`, margin, yPosition);
        
        // Link in blue
        pdf.setTextColor(0, 102, 204);
        const refText = block.text;
        const lines = pdf.splitTextToSize(refText, contentWidth - 10);
        
        for (const line of lines) {
          if (yPosition > pageHeight - margin - 10) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin + 8, yPosition);
          yPosition += 4;
        }
        
        yPosition += 1; // Small gap between references
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
      }
    }

    const filename = `${sanitizeFilename(options.title)}.pdf`;
    pdf.save(filename);
    
    hideExportProgress(loadingToast);
    console.log('✅ PDF exported:', filename);
    showSuccessToast('PDF downloaded successfully!');
  } catch (error) {
    console.error('Error exporting PDF:', error);
    showErrorToast('Failed to export PDF. Please try again.');
    throw error;
  }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function getPDFPageNumber(pdf: jsPDF, anchorName: string): number {
  // This is a placeholder - jsPDF doesn't easily support internal anchors
  // We'll use a workaround with link positioning
  return 1;
}

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list-item' | 'reference';
  text: string;
  level?: number;
  number?: number;
}

function parseContentForPDF(element: HTMLElement): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  
  const processElement = (el: Element) => {
    const tagName = el.tagName.toLowerCase();
    
    if (/^h[1-6]$/.test(tagName)) {
      const level = parseInt(tagName[1]);
      const text = el.textContent?.trim() || '';
      if (text && text !== 'References') {
        blocks.push({ type: 'heading', text, level });
      }
    } else if (tagName === 'p') {
      const text = el.textContent?.trim() || '';
      if (text) {
        // Fix special characters like ₹
        const fixedText = text.replace(/₹/g, 'Rs.').replace(/[^\x00-\x7F]/g, (char) => {
          // Replace non-ASCII chars that jsPDF can't handle
          const replacements: { [key: string]: string } = {
            '₹': 'Rs.',
            '€': 'EUR',
            '£': 'GBP',
            '¥': 'JPY',
            '₿': 'BTC',
          };
          return replacements[char] || char;
        });
        blocks.push({ type: 'paragraph', text: fixedText });
      }
    } else if (tagName === 'li') {
      const text = el.textContent?.trim() || '';
      if (text) {
        blocks.push({ type: 'list-item', text });
      }
    } else if (el.classList.contains('reference-item')) {
      const numberEl = el.querySelector('.reference-number');
      const linkEl = el.querySelector('.reference-link, .reference-placeholder');
      
      if (numberEl && linkEl) {
        const number = parseInt(numberEl.textContent?.replace('.', '') || '0');
        const text = linkEl.textContent?.trim() || '';
        if (number && text) {
          blocks.push({ type: 'reference', text, number });
        }
      }
    }
    
    if (!el.classList.contains('reference-item')) {
      Array.from(el.children).forEach(processElement);
    }
  };
  
  processElement(element);
  return blocks;
}

interface TextSegment {
  text: string;
  isCitation: boolean;
}

function parseTextWithCitations(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const citationRegex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match;
  
  while ((match = citationRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        isCitation: false,
      });
    }
    
    segments.push({
      text: match[1],
      isCitation: true,
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isCitation: false,
    });
  }
  
  return segments.length > 0 ? segments : [{ text, isCitation: false }];
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

function showExportProgress(message: string): HTMLDivElement {
  const toast = document.createElement('div');
  toast.className = 'fixed top-24 right-8 z-50 bg-card border rounded-xl shadow-xl px-4 py-3 flex items-center gap-2';
  toast.innerHTML = `
    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="text-sm font-medium">${message}</span>
  `;
  document.body.appendChild(toast);
  return toast;
}

function hideExportProgress(toast: HTMLDivElement): void {
  if (toast && toast.parentNode) {
    toast.parentNode.removeChild(toast);
  }
}

function showSuccessToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'fixed top-24 right-8 z-50 bg-card border rounded-xl shadow-xl px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2';
  toast.innerHTML = `
    <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span class="text-sm font-medium">${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

function showErrorToast(message: string): void {
  const toast = document.createElement('div');
  toast.className = 'fixed top-24 right-8 z-50 bg-card border rounded-xl shadow-xl px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2';
  toast.innerHTML = `
    <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
    <span class="text-sm font-medium">${message}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}
