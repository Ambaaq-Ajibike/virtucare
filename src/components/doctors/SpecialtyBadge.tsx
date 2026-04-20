import { Badge } from '@/components/ui/Badge';
import type { Specialty } from '@/types';

export function SpecialtyBadge({ specialty }: { specialty: Specialty }) {
  return <Badge tone="accent">{specialty}</Badge>;
}
