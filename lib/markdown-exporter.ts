/**
 * Copy the current page as markdown to clipboard
 */
export async function copyAsMarkdown(title: string, rawMarkdown: string): Promise<void> {
  try {
    console.log('📋 Copying markdown to clipboard...');
    
    if (!rawMarkdown) {
      throw new Error('No markdown content available');
    }

    // Prepare markdown with title
    const fullMarkdown = `# ${title}\n\n${rawMarkdown}`;

    // Copy to clipboard
    await navigator.clipboard.writeText(fullMarkdown);
    
    console.log('✅ Markdown copied to clipboard');
    showSuccessToast('Markdown copied to clipboard!');
  } catch (error) {
    console.error('Error copying markdown:', error);
    
    // Fallback: Try using older clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = `# ${title}\n\n${rawMarkdown}`;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      showSuccessToast('Markdown copied to clipboard!');
    } catch (fallbackError) {
      showErrorToast('Failed to copy markdown. Please try again.');
      throw fallbackError;
    }
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

