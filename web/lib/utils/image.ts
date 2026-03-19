// Utility functions for responsive image handling
export function getOptimizedImageSrc(
  originalSrc: string, 
  size: 'thumb' | 'full' = 'full',
  format: 'webp' | 'avif' | 'jpg' = 'webp'
): string {
  if (!originalSrc) return '';
  
  // Remove file extension
  const basePath = originalSrc.replace(/\.[^/.]+$/, '');
  
  // Add size suffix if needed
  const sizedPath = size === 'thumb' ? `${basePath}-thumb` : basePath;
  
  return `${sizedPath}.${format}`;
}

export function getImageSrcSet(originalSrc: string): string {
  if (!originalSrc) return '';
  
  const basePath = originalSrc.replace(/\.[^/.]+$/, '');
  
  return [
    `${basePath}-thumb.webp 400w`,
    `${basePath}.webp 800w`
  ].join(', ');
}

export function getImageSizes(): string {
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
}

// Get fallback image with progressive enhancement
export function getImageSources(originalSrc: string) {
  if (!originalSrc) return { src: '', srcSet: '', sources: [] };
  
  const basePath = originalSrc.replace(/\.[^/.]+$/, '');
  
  return {
    src: `${basePath}.jpg`, // Fallback
    srcSet: getImageSrcSet(originalSrc),
    sources: [
      {
        type: 'image/avif',
        srcSet: [
          `${basePath}-thumb.avif 400w`,
          `${basePath}.avif 800w`
        ].join(', ')
      },
      {
        type: 'image/webp',
        srcSet: [
          `${basePath}-thumb.webp 400w`,
          `${basePath}.webp 800w`
        ].join(', ')
      }
    ]
  };
}