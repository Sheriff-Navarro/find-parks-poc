import { useId, type Ref } from 'react'
import { Search, X } from 'lucide-react'
import { joinClasses } from '../ui/joinClasses.ts'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  ref?: Ref<HTMLInputElement>
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

export function SearchInput({
  value,
  onChange,
  placeholder = 'Name, address, or amenity',
  className,
  ref,
}: SearchInputProps) {
  const inputId = useId()

  return (
    <div className={joinClasses('flex flex-col gap-1', className)}>
      <label aria-hidden="true" htmlFor={inputId} className="text-sm font-medium text-ink" />
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
        />
        <input
          ref={ref}
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && value !== '') {
              event.preventDefault()
              onChange('')
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className={`w-full rounded-xl border border-slate-300 bg-surface py-2.5 pr-10 pl-9 text-base text-ink placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none ${focusRing}`}
        />
        {value !== '' && (
          <button
            type="button"
            onClick={() => {
              onChange('')
              document.getElementById(inputId)?.focus()
            }}
            aria-label="Clear search"
            className={`absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-chip hover:text-ink ${focusRing}`}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
