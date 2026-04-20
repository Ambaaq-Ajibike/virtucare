import { cn } from '@/lib/cn';

const TONES = [
  'bg-[#E8E3D8] text-[#6B5F4A]',
  'bg-[#DCE8E3] text-[#2F5D51]',
  'bg-[#E6DEEB] text-[#5B4872]',
  'bg-[#E8D9D3] text-[#7A4A3B]',
  'bg-[#D8E1EA] text-[#385470]',
  'bg-[#E9E3CF] text-[#6C6233]',
];

function initials(name: string): string {
  const parts = name.replace(/^Dr\.?\s+/i, '').trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function toneFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[hash % TONES.length];
}

type DoctorAvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<DoctorAvatarProps['size']>, string> = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
};

export function DoctorAvatar({
  name,
  size = 'md',
  className,
}: DoctorAvatarProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-medium',
        SIZE_CLASSES[size],
        toneFor(name),
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
