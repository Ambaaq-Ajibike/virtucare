'use client';

import { useId } from 'react';
import { Input } from '@/components/ui/Input';
import { maxBookableIso, todayIso } from '@/lib/date';

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  label?: string;
  describedBy?: string;
};

export function DatePicker({
  value,
  onChange,
  invalid,
  label = 'Date',
  describedBy,
}: DatePickerProps) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={todayIso()}
        max={maxBookableIso()}
        invalid={invalid}
        aria-describedby={describedBy}
        className="mt-1.5 [color-scheme:light]"
      />
    </div>
  );
}
