import { cn } from '../lib/cn'

type Option<T extends string> = {
  label: string
  value: T
}

type SegmentedControlProps<T extends string> = {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </span>
      <div className="inline-flex w-fit flex-wrap rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium text-zinc-500 transition',
              'hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900',
              value === option.value && 'bg-zinc-950 text-white shadow-sm hover:text-white',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
