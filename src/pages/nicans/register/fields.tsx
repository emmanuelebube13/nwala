import type { HTMLAttributes, ReactNode } from 'react'
import { Check, Minus, Plus, WarningCircle } from '@phosphor-icons/react'

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p className="nc-error rg-error" id={id}>
      <WarningCircle size={18} weight="bold" aria-hidden="true" />
      <span>
        <span className="sr-only">Error: </span>
        {children}
      </span>
    </p>
  )
}

const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  optional?: boolean
  type?: string
  autoComplete?: string
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode']
  placeholder?: string
  maxLength?: number
  multiline?: boolean
  className?: string
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  optional,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  maxLength,
  multiline,
  className,
}: TextFieldProps) {
  const aria = {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(hint && `${id}-hint`, error && `${id}-error`),
  }
  return (
    <div className={`nc-field rg-field${className ? ` ${className}` : ''}`}>
      <label className="nc-label" htmlFor={id}>
        {label}
        {optional && <span className="rg-optional"> (optional)</span>}
      </label>
      {hint && (
        <p className="nc-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
      {multiline ? (
        <textarea
          id={id}
          className="nc-textarea"
          rows={4}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          {...aria}
        />
      ) : (
        <input
          id={id}
          className="nc-input"
          type={type}
          value={value}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={!optional}
          {...aria}
        />
      )}
    </div>
  )
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  options: { value: string; label: string }[]
  error?: string
  hint?: string
}) {
  return (
    <div className="nc-field rg-field">
      <label className="nc-label" htmlFor={id}>
        {label}
      </label>
      {hint && (
        <p className="nc-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
      <select
        id={id}
        className="nc-select rg-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint && `${id}-hint`, error && `${id}-error`)}
      >
        <option value="">Choose one</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Radio group rendered as large tappable cards. The first input's id is `${id}-0` (error focus target). */
export function ChoiceCards({
  id,
  legend,
  value,
  onChange,
  options,
  error,
  hint,
  columns = 3,
}: {
  id: string
  legend: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; desc?: string }[]
  error?: string
  hint?: string
  columns?: number
}) {
  return (
    <fieldset
      className="rg-fieldset"
      aria-describedby={describedBy(hint && `${id}-hint`, error && `${id}-error`)}
    >
      <legend className="nc-label">{legend}</legend>
      {hint && (
        <p className="nc-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
      <div className={`rg-cards rg-cards--${columns}${error ? ' is-invalid' : ''}`}>
        {options.map((o, i) => (
          <label key={o.value} className={`rg-radio${value === o.value ? ' is-checked' : ''}`}>
            <input
              type="radio"
              id={`${id}-${i}`}
              name={id}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span className="rg-radio__dot" aria-hidden="true" />
            <span className="rg-radio__text">
              <span className="rg-radio__label">{o.label}</span>
              {o.desc && <span className="rg-radio__desc">{o.desc}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** Checkbox group rendered as chips. The first input's id is `${id}-0`. */
export function ChipGroup({
  id,
  legend,
  values,
  onChange,
  options,
  error,
  hint,
}: {
  id: string
  legend: string
  values: string[]
  onChange: (v: string[]) => void
  options: string[]
  error?: string
  hint?: string
}) {
  const toggle = (o: string) => onChange(values.includes(o) ? values.filter((v) => v !== o) : [...values, o])
  return (
    <fieldset
      className="rg-fieldset"
      aria-describedby={describedBy(hint && `${id}-hint`, error && `${id}-error`)}
    >
      <legend className="nc-label">{legend}</legend>
      {hint && (
        <p className="nc-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
      <div className="rg-chips">
        {options.map((o, i) => {
          const on = values.includes(o)
          return (
            <label key={o} className={`rg-chip${on ? ' is-checked' : ''}`}>
              <input type="checkbox" id={`${id}-${i}`} checked={on} onChange={() => toggle(o)} />
              <span className="rg-chip__box" aria-hidden="true">
                <Check size={12} weight="bold" />
              </span>
              {o}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function NumberStepper({
  id,
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div className="rg-stepnum" role="group" aria-labelledby={`${id}-label`}>
      <div>
        <p className="nc-label" id={`${id}-label`}>
          {label}
        </p>
        {hint && <p className="nc-hint">{hint}</p>}
      </div>
      <div className="rg-stepnum__ctrl">
        <button
          type="button"
          className="rg-stepnum__btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
        >
          <Minus size={18} weight="bold" aria-hidden="true" />
        </button>
        <output id={id} className="rg-stepnum__val" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className="rg-stepnum__btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
        >
          <Plus size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function Checkbox({
  id,
  checked,
  onChange,
  children,
  error,
}: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  children: ReactNode
  error?: string
}) {
  return (
    <div className="rg-consent">
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
      <label className={`rg-consent__row${checked ? ' is-checked' : ''}${error ? ' is-invalid' : ''}`}>
        <span className="rg-box">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <Check size={14} weight="bold" className="rg-box__icon" aria-hidden="true" />
        </span>
        <span>{children}</span>
      </label>
    </div>
  )
}
