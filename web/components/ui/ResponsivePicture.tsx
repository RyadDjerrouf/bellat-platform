import { getImageSources } from '@/lib/utils/image';

interface ResponsivePictureProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function ResponsivePicture({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: ResponsivePictureProps) {
  const { src: fallbackSrc, sources } = getImageSources(src);

  return (
    <picture className={className}>
      {sources.map((source, index) => (
        <source
          key={index}
          type={source.type}
          srcSet={source.srcSet}
          sizes={sizes}
        />
      ))}
      <img
        src={fallbackSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="w-full h-full object-cover"
        style={{
          aspectRatio: '1/1'
        }}
      />
    </picture>
  );
}