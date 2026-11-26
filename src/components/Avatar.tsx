export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
  placeholder?: string;
}

export default function Avatar({
  src,
  name,
  className = '',
  fallbackClassName = '',
  placeholder = 'U',
}: AvatarProps) {
  if (src) {
    return <img src={src} alt={name ?? ''} className={`object-cover ${className}`} />;
  }

  const initial = (name?.trim()?.[0] ?? placeholder).toUpperCase();

  return (
    <div className={`flex items-center justify-center font-bold ${className} ${fallbackClassName}`}>
      {initial}
    </div>
  );
}
