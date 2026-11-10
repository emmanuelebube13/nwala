import { useEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  CalendarPlus,
  Check,
  CheckCircle,
  Clock,
  Info,
  MapPin,
  PencilSimple,
  Plus,
  SpinnerGap,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react'
import NicansLayout, { NC } from '../../components/nicans/NicansLayout.tsx'
import { saveLiveRegistration } from '../../data/nicans.ts'
import {
  availabilityOptions,
  draftIsEmpty,
  emptyChild,
  households,
  initialData,
  languages,
  newcomerNeeds,
  orgTypes,
  partnerCollab,
  resolveFlow,
  validateChild,
  validateStep,
  volunteerInterests,
  type Child,
  type Flow,
  type FormData,
} from './register/config.ts'
import { Checkbox, ChipGroup, ChoiceCards, NumberStepper, SelectField, TextField } from './register/fields.tsx'
import { buildIcs, downloadIcs, parseDisplayDate } from './register/ics.ts'
import './register.css'

type Errors = Record<string, string>
type Step = 1 | 2 | 3

interface Saved {
  step: Step
  data: FormData
}

const storageKey = (flow: Flow) => `nicans:register:${flow.key}`

function loadSaved(flow: Flow): Saved {
  try {
    const raw = sessionStorage.getItem(storageKey(flow))
    if (raw) {
      const s = JSON.parse(raw) as Saved
      return { step: s.step, data: { ...initialData(), ...s.data } }
    }
  } catch {
    /* storage unavailable */
  }
  return { step: 1, data: initialData() }
}

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

/** Formats typed digits as DD/MM/YYYY. */
function formatDob(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const fullName = (c: { firstName: string; lastName: string }) => `${c.firstName.trim()} ${c.lastName.trim()}`.trim()

/* ------------------------------------------------------------------ */

function Stepper({ flow, step }: { flow: Flow; step: Step }) {
  return (
    <ol className="rg-stepper" aria-label="Registration progress">
      {flow.steps.map((label, i) => {
        const n = i + 1
        const state = n < step ? 'done' : n === step ? 'current' : 'next'
        const status = state === 'done' ? 'Completed' : state === 'current' ? 'In progress' : 'Up next'
        return (
          <li key={label} className={`rg-stepper__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="rg-stepper__circle" aria-hidden="true">
              {state === 'done' ? <Check size={16} weight="bold" /> : n}
            </span>
            <span className="rg-stepper__text">
              <span className="rg-stepper__label">{label}</span>
              <span className="rg-stepper__status">
                <span className="sr-only">Step {n}: </span>
                {status}
              </span>
            </span>
            {n < 3 && (
              <span className="rg-stepper__bar" aria-hidden="true">
                <span style={{ transform: `scaleX(${n < step ? 1 : 0})` }} />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function ErrorSummary({ errors }: { errors: Errors }) {
  const keys = Object.keys(errors)
  if (!keys.length) return null
  return (
    <div className="rg-summary" role="alert" aria-labelledby="rg-summary-title">
      <h3 id="rg-summary-title">
        <WarningCircle size={22} weight="bold" aria-hidden="true" />
        {keys.length === 1 ? 'There is 1 thing to fix' : `There are ${keys.length} things to fix`}
      </h3>
      <ul>
        {keys.map((k) => (
          <li key={k}>
            <a
              href={`#${k}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(k)
                el?.focus()
                el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
              }}
            >
              {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepFooter({ step, onBack, submitting, submitLabel }: { step: Step; onBack: () => void; submitting?: boolean; submitLabel?: string }) {
  return (
    <div className="rg-footer">
      <p className="rg-footer__privacy">
        We only ask for what we need. See our <Link to={NC}>privacy policy</Link>.
      </p>
      <div className="rg-footer__actions">
        {step > 1 ? (
          <button type="button" className="nc-btn nc-btn--outline rg-back" onClick={onBack}>
            <span className="nc-studs" aria-hidden="true" />
            <ArrowLeft size={18} aria-hidden="true" />
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className={`nc-btn nc-btn--primary rg-continue${submitting ? ' is-loading' : ''}`} aria-disabled={submitting || undefined}>
          {submitting ? (
            <>
              <SpinnerGap size={18} className="rg-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              {submitLabel ?? 'Continue'}
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function ReviewSection({ title, step, onChange, rows }: { title: string; step: Step; onChange: (s: Step) => void; rows: [string, ReactNode][] }) {
  return (
    <section className="rg-review" aria-label={title}>
      <div className="rg-review__head">
        <h3>{title}</h3>
        <button type="button" className="rg-linkbtn" onClick={() => onChange(step)}>
          Change<span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </div>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="rg-review__row">
            <dt>{k}</dt>
            <dd>{v || <span className="rg-muted">Not given</span>}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function RegistrationFlow({ flow }: { flow: Flow }) {
  const [saved] = useState(() => loadSaved(flow))
  const [step, setStep] = useState<Step>(saved.step)
  const [data, setData] = useState<FormData>(saved.data)
  const [errors, setErrors] = useState<Errors>({})
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<FormData | null>(null)
  const [announce, setAnnounce] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const draftCardRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  // Persist in-progress form.
  useEffect(() => {
    if (done) return
    try {
      sessionStorage.setItem(storageKey(flow), JSON.stringify({ step, data }))
    } catch {
      /* ignore */
    }
  }, [flow, step, data, done])

  // Move focus to the step heading on step change (not on first load).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.closest('.rg')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [step, done])

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setData((d) => ({ ...d, [k]: v }))
  const setDraft = (patch: Partial<Child>) => setData((d) => ({ ...d, draft: { ...d.draft, ...patch } }))

  const focusFirst = (errs: Errors) => {
    const first = Object.keys(errs)[0]
    if (!first) return
    requestAnimationFrame(() => {
      const el = document.getElementById(first)
      el?.focus({ preventScroll: true })
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })
  }

  /** On blur: flag a field that has a value (or was already attempted) and is invalid. */
  const revalidate = (key: string, hasValue: boolean) => {
    if (!hasValue && !attempted) return
    const all = validateStep(step, flow.kind, data)
    if (all[key]) setErrors((prev) => (prev[key] === all[key] ? prev : { ...prev, [key]: all[key] }))
  }

  // While typing: clear errors as soon as they are fixed (never add new ones, so layout stays put before a click).
  useEffect(() => {
    setErrors((prev) => {
      const keys = Object.keys(prev)
      if (!keys.length) return prev
      const all = { ...validateStep(step, flow.kind, data), ...(step === 2 && flow.kind === 'children' ? validateChild(data.draft) : {}) }
      let changed = false
      const next: Errors = {}
      for (const k of keys) {
        if (all[k]) {
          next[k] = all[k]
          if (all[k] !== prev[k]) changed = true
        } else changed = true
      }
      return changed ? next : prev
    })
  }, [data, step, flow.kind])

  const goTo = (s: Step) => {
    setErrors({})
    setAttempted(false)
    setStep(s)
  }

  const commitDraft = (d: FormData): FormData => {
    if (draftIsEmpty(d.draft)) return d
    const child = { ...d.draft, id: d.editingId ?? uid() }
    const children = d.editingId ? d.children.map((c) => (c.id === d.editingId ? child : c)) : [...d.children, child]
    return { ...d, children, draft: emptyChild(), editingId: null }
  }

  const saveChild = () => {
    const errs = validateChild(data.draft)
    if (Object.keys(errs).length) {
      setAttempted(true)
      setErrors(errs)
      focusFirst(errs)
      return
    }
    const name = fullName(data.draft)
    const wasEditing = !!data.editingId
    setData((d) => commitDraft(d))
    setErrors({})
    setAttempted(false)
    setAnnounce(wasEditing ? `${name} updated.` : `${name} added. You can now add another child.`)
    requestAnimationFrame(() => document.getElementById('child-first')?.focus())
  }

  const editChild = (c: Child) => {
    setData((d) => ({ ...commitDraftIfSafe(d), draft: { ...c }, editingId: c.id }))
    setErrors({})
    setAnnounce(`Editing ${fullName(c)}.`)
    requestAnimationFrame(() => {
      draftCardRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      document.getElementById('child-first')?.focus({ preventScroll: true })
    })
  }

  // Switching to edit another child keeps any valid draft instead of dropping it.
  const commitDraftIfSafe = (d: FormData) =>
    !draftIsEmpty(d.draft) && Object.keys(validateChild(d.draft)).length === 0 ? commitDraft(d) : d

  const removeChild = (c: Child) => {
    setData((d) => ({
      ...d,
      children: d.children.filter((x) => x.id !== c.id),
      ...(d.editingId === c.id ? { draft: emptyChild(), editingId: null } : {}),
    }))
    setAnnounce(`${fullName(c)} removed.`)
  }

  const cancelEdit = () => {
    setData((d) => ({ ...d, draft: emptyChild(), editingId: null }))
    setErrors({})
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    const errs = validateStep(step, flow.kind, data)
    if (Object.keys(errs).length) {
      setAttempted(true)
      setErrors(errs)
      focusFirst(errs)
      return
    }
    if (step === 1) return goTo(2)
    if (step === 2) {
      if (flow.kind === 'children') setData((d) => commitDraft(d))
      return goTo(3)
    }
    setSubmitting(true)
    window.setTimeout(() => {
      const isEvent = flow.kind === 'event'
      saveLiveRegistration({
        id: uid(),
        name: fullName(data),
        email: data.email.trim(),
        program: flow.dashboardProgram,
        submitted: new Date().toISOString().slice(0, 10),
        status: isEvent ? 'Confirmed' : 'Pending review',
        ...(flow.kind === 'children' ? { children: data.children.length } : {}),
        ...(isEvent && data.kids > 0 ? { children: data.kids } : {}),
      })
      try {
        sessionStorage.removeItem(storageKey(flow))
      } catch {
        /* ignore */
      }
      setSubmitting(false)
      setDone(data)
    }, 700)
  }

  const err = (k: string) => errors[k]

  if (done) return <Confirmation flow={flow} data={done} headingRef={headingRef} />

  /* ---------- steps ---------- */

  const step1 = (
    <div className="rg-card">
      <div className="rg-grid2">
        <TextField
          id="rg-first"
          label="First name"
          autoComplete="given-name"
          value={data.firstName}
          onChange={(v) => set('firstName', v)}
          onBlur={() => revalidate('rg-first', !!data.firstName)}
          error={err('rg-first')}
        />
        <TextField
          id="rg-last"
          label="Last name"
          autoComplete="family-name"
          value={data.lastName}
          onChange={(v) => set('lastName', v)}
          onBlur={() => revalidate('rg-last', !!data.lastName)}
          error={err('rg-last')}
        />
      </div>
      <TextField
        id="rg-email"
        label="Email address"
        type="email"
        autoComplete="email"
        hint="We’ll send your confirmation here."
        value={data.email}
        onChange={(v) => set('email', v)}
        onBlur={() => revalidate('rg-email', !!data.email)}
        error={err('rg-email')}
      />
      <TextField
        id="rg-phone"
        label="Phone number"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        optional
        hint="Only used if we need to reach you quickly."
        value={data.phone}
        onChange={(v) => set('phone', v)}
        onBlur={() => revalidate('rg-phone', !!data.phone)}
        error={err('rg-phone')}
      />
      <div className="rg-grid2">
        <SelectField
          id="rg-language"
          label="Preferred language"
          options={languages}
          value={data.language}
          onChange={(v) => set('language', v)}
          onBlur={() => revalidate('rg-language', !!data.language)}
          error={err('rg-language')}
        />
        {data.language === 'Other' && (
          <TextField id="rg-language-other" label="Which language?" optional value={data.languageOther} onChange={(v) => set('languageOther', v)} />
        )}
      </div>
      <StepFooter step={1} onBack={() => undefined} />
    </div>
  )

  const childNo = data.editingId ? data.children.findIndex((c) => c.id === data.editingId) + 1 : data.children.length + 1
  const childrenStep = (
    <>
      {data.children.length > 0 && (
        <div className="rg-card rg-added">
          <p className="rg-eyebrow">
            {data.children.length} {data.children.length === 1 ? 'child' : 'children'} added
          </p>
          <ul>
            {data.children.map((c) => {
              const editing = c.id === data.editingId
              return (
                <li key={c.id} className={`rg-added__item${editing ? ' is-editing' : ''}`}>
                  <div className="rg-added__main">
                    <p className="rg-added__name">{fullName(c)}</p>
                    <p className="rg-added__meta">Igbo language level: {c.level}</p>
                  </div>
                  <span className={`rg-chip-tag${editing ? ' is-editing' : ''}`}>
                    {editing ? <PencilSimple size={12} weight="bold" aria-hidden="true" /> : <Check size={12} weight="bold" aria-hidden="true" />}
                    {editing ? 'Editing' : 'Added'}
                  </span>
                  <div className="rg-added__actions">
                    <button type="button" className="rg-linkbtn" onClick={() => editChild(c)} disabled={editing}>
                      <PencilSimple size={16} aria-hidden="true" />
                      Edit<span className="sr-only"> {fullName(c)}</span>
                    </button>
                    <button type="button" className="rg-linkbtn rg-linkbtn--muted" onClick={() => removeChild(c)}>
                      <Trash size={16} aria-hidden="true" />
                      Remove<span className="sr-only"> {fullName(c)}</span>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <div className="rg-card" ref={draftCardRef}>
        <p className="rg-eyebrow">
          Child {childNo} · {data.editingId ? 'Editing' : 'In progress'}
        </p>
        <h3 className="rg-card__title">
          {data.editingId
            ? `Edit ${data.draft.firstName.trim() || 'child'}’s details`
            : data.children.length
              ? 'Tell us about another child'
              : 'Tell us about your child'}
        </h3>
        <div className="rg-grid2">
          <TextField
            id="child-first"
            label="Child’s first name"
            value={data.draft.firstName}
            onChange={(v) => setDraft({ firstName: v })}
            onBlur={() => revalidate('child-first', !!data.draft.firstName)}
            error={err('child-first')}
          />
          <TextField
            id="child-last"
            label="Child’s last name"
            value={data.draft.lastName}
            onChange={(v) => setDraft({ lastName: v })}
            onBlur={() => revalidate('child-last', !!data.draft.lastName)}
            error={err('child-last')}
          />
        </div>
        <div className="rg-grid2">
          <TextField
            id="child-dob"
            label="Date of birth"
            hint="For example, 27/03/2019"
            placeholder="DD/MM/YYYY"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            value={data.draft.dob}
            onChange={(v) => setDraft({ dob: formatDob(v) })}
            onBlur={() => revalidate('child-dob', !!data.draft.dob)}
            error={err('child-dob')}
          />
        </div>
        <ChoiceCards
          id="child-level"
          legend="Igbo language level"
          value={data.draft.level}
          onChange={(v) => {
            setDraft({ level: v as Child['level'] })
            setErrors((p) => {
              const n = { ...p }
              delete n['child-level-0']
              return n
            })
          }}
          options={[
            { value: 'None', label: 'None' },
            { value: 'Some', label: 'Some' },
            { value: 'Fluent', label: 'Fluent' },
          ]}
          error={err('child-level-0')}
        />
        <TextField
          id="child-notes"
          label="Allergies or medical notes"
          optional
          multiline
          hint="Let us know anything our volunteers should be aware of."
          value={data.draft.notes}
          onChange={(v) => setDraft({ notes: v })}
        />
        <div className="rg-addrow">
          <button type="button" className="rg-linkbtn rg-linkbtn--strong" onClick={saveChild}>
            {data.editingId ? <Check size={18} weight="bold" aria-hidden="true" /> : <Plus size={18} weight="bold" aria-hidden="true" />}
            {data.editingId ? 'Save changes' : 'Save and add another child'}
          </button>
          {data.editingId && (
            <button type="button" className="rg-linkbtn rg-linkbtn--muted" onClick={cancelEdit}>
              Cancel editing
            </button>
          )}
        </div>
        <StepFooter step={2} onBack={() => goTo(1)} />
      </div>
      <aside className="rg-note" aria-label="Registration note">
        <p className="rg-eyebrow">
          <Info size={14} weight="bold" aria-hidden="true" /> Registration note
        </p>
        <p>Added children stay visible and can be edited while you enter another child’s details.</p>
      </aside>
    </>
  )

  const eventStep = (
    <div className="rg-card">
      <div className="rg-stack">
        <NumberStepper id="rg-adults" label="Adults" hint="18 and over" value={data.adults} min={1} max={10} onChange={(v) => set('adults', v)} />
        <NumberStepper id="rg-kids" label="Children" hint="Under 18" value={data.kids} min={0} max={10} onChange={(v) => set('kids', v)} />
      </div>
      <TextField
        id="rg-access"
        label="Accessibility needs"
        optional
        multiline
        hint="For example, step-free access, seating, quiet space or dietary needs."
        value={data.access}
        onChange={(v) => set('access', v)}
      />
      <StepFooter step={2} onBack={() => goTo(1)} />
    </div>
  )

  const clearKey = (k: string) =>
    setErrors((p) => {
      if (!p[k]) return p
      const n = { ...p }
      delete n[k]
      return n
    })

  const volunteerStep = (
    <div className="rg-card">
      <ChipGroup
        id="rg-interests"
        legend="What would you like to help with?"
        hint="Choose all that apply."
        options={volunteerInterests}
        values={data.interests}
        onChange={(v) => {
          set('interests', v)
          if (v.length) clearKey('rg-interests-0')
        }}
        error={err('rg-interests-0')}
      />
      <ChipGroup
        id="rg-avail"
        legend="When are you usually available?"
        options={availabilityOptions}
        values={data.availability}
        onChange={(v) => {
          set('availability', v)
          if (v.length) clearKey('rg-avail-0')
        }}
        error={err('rg-avail-0')}
      />
      <TextField
        id="rg-why"
        label="Why do you want to volunteer?"
        optional
        multiline
        maxLength={600}
        hint="A sentence or two is plenty."
        value={data.why}
        onChange={(v) => set('why', v)}
      />
      <StepFooter step={2} onBack={() => goTo(1)} />
    </div>
  )

  const memberStep = (
    <div className="rg-card">
      <ChoiceCards
        id="rg-household"
        legend="Membership type"
        columns={2}
        options={households}
        value={data.household}
        onChange={(v) => {
          set('household', v)
          clearKey('rg-household-0')
        }}
        error={err('rg-household-0')}
      />
      {data.household === 'Family' && (
        <>
          <NumberStepper id="rg-size" label="People in your household" value={data.householdSize} min={2} max={12} onChange={(v) => set('householdSize', v)} />
          <TextField
            id="rg-names"
            label="Names of other household members"
            optional
            multiline
            hint="One name per line. This helps us welcome everyone at events."
            value={data.householdNames}
            onChange={(v) => set('householdNames', v)}
          />
        </>
      )}
      <StepFooter step={2} onBack={() => goTo(1)} />
    </div>
  )

  const partnerStep = (
    <div className="rg-card">
      <TextField
        id="rg-org"
        label="Organisation name"
        autoComplete="organization"
        value={data.orgName}
        onChange={(v) => set('orgName', v)}
        onBlur={() => revalidate('rg-org', !!data.orgName)}
        error={err('rg-org')}
      />
      <SelectField
        id="rg-orgtype"
        label="Type of organisation"
        options={orgTypes}
        value={data.orgType}
        onChange={(v) => set('orgType', v)}
        onBlur={() => revalidate('rg-orgtype', !!data.orgType)}
        error={err('rg-orgtype')}
      />
      <ChipGroup
        id="rg-collab"
        legend="How would you like to work together?"
        hint="Choose all that apply."
        options={partnerCollab}
        values={data.collab}
        onChange={(v) => {
          set('collab', v)
          if (v.length) clearKey('rg-collab-0')
        }}
        error={err('rg-collab-0')}
      />
      <TextField id="rg-orgmsg" label="Anything else we should know?" optional multiline value={data.orgMessage} onChange={(v) => set('orgMessage', v)} />
      <StepFooter step={2} onBack={() => goTo(1)} />
    </div>
  )

  const newcomerStep = (
    <div className="rg-card">
      <div className="rg-grid2">
        <TextField
          id="rg-arrival"
          label="Arrival date"
          type="date"
          optional
          hint="When you arrived, or plan to."
          value={data.arrival}
          onChange={(v) => set('arrival', v)}
        />
        <TextField
          id="rg-city"
          label="City or town"
          autoComplete="address-level2"
          hint="For example, Halifax or Dartmouth."
          value={data.city}
          onChange={(v) => set('city', v)}
          onBlur={() => revalidate('rg-city', !!data.city)}
          error={err('rg-city')}
        />
      </div>
      <ChipGroup
        id="rg-needs"
        legend="What would help most right now?"
        hint="Choose all that apply."
        options={newcomerNeeds}
        values={data.needs}
        onChange={(v) => {
          set('needs', v)
          if (v.length) clearKey('rg-needs-0')
        }}
        error={err('rg-needs-0')}
      />
      <TextField
        id="rg-nnotes"
        label="Anything else you’d like us to know?"
        optional
        multiline
        value={data.newcomerNotes}
        onChange={(v) => set('newcomerNotes', v)}
      />
      <StepFooter step={2} onBack={() => goTo(1)} />
    </div>
  )

  const step2 = {
    children: childrenStep,
    event: eventStep,
    volunteer: volunteerStep,
    member: memberStep,
    partner: partnerStep,
    newcomer: newcomerStep,
  }[flow.kind]

  const lang = data.language === 'Other' && data.languageOther.trim() ? data.languageOther.trim() : data.language
  const step2Rows: [string, ReactNode][] = (() => {
    switch (flow.kind) {
      case 'children':
        return data.children.map((c, i) => [
          `Child ${i + 1}`,
          <>
            <strong>{fullName(c)}</strong>
            <br />
            Born {c.dob} · Igbo: {c.level}
            {c.notes.trim() && (
              <>
                <br />
                Notes: {c.notes.trim()}
              </>
            )}
          </>,
        ])
      case 'event':
        return [
          ['Adults', String(data.adults)],
          ['Children', String(data.kids)],
          ['Accessibility needs', data.access.trim()],
        ]
      case 'volunteer':
        return [
          ['Interests', data.interests.join(', ')],
          ['Availability', data.availability.join(', ')],
          ['Why', data.why.trim()],
        ]
      case 'member':
        return [
          ['Membership type', data.household],
          ...(data.household === 'Family'
            ? ([
                ['Household size', String(data.householdSize)],
                ['Other members', data.householdNames.trim()],
              ] as [string, string][])
            : []),
        ]
      case 'partner':
        return [
          ['Organisation', data.orgName.trim()],
          ['Type', data.orgType],
          ['Working together', data.collab.join(', ')],
          ['Message', data.orgMessage.trim()],
        ]
      case 'newcomer':
        return [
          ['Arrival date', data.arrival],
          ['City or town', data.city.trim()],
          ['Help with', data.needs.join(', ')],
          ['Notes', data.newcomerNotes.trim()],
        ]
    }
  })()

  const step3 = (
    <div className="rg-card">
      <ReviewSection
        title={flow.steps[0]}
        step={1}
        onChange={goTo}
        rows={[
          ['Name', fullName(data)],
          ['Email', data.email.trim()],
          ['Phone', data.phone.trim()],
          ['Preferred language', lang],
        ]}
      />
      <ReviewSection title={flow.steps[1]} step={2} onChange={goTo} rows={step2Rows} />
      <fieldset className="rg-fieldset rg-consents">
        <legend className="nc-label">Consent</legend>
        <Checkbox
          id="rg-consent"
          checked={data.consent}
          onChange={(v) => {
            set('consent', v)
            if (v) clearKey('rg-consent')
          }}
          error={err('rg-consent')}
        >
          I agree NICANS may contact me about this registration. <span className="rg-required">(Required)</span>
        </Checkbox>
        {(flow.kind === 'children' || (flow.kind === 'event' && data.kids > 0)) && (
          <Checkbox id="rg-photo" checked={data.photo} onChange={(v) => set('photo', v)}>
            NICANS may share photos of my {flow.kind === 'children' && data.children.length === 1 ? 'child' : 'children'} from this program
            in community newsletters and social media. <span className="rg-muted">(Optional)</span>
          </Checkbox>
        )}
      </fieldset>
      <StepFooter step={3} onBack={() => goTo(2)} submitting={submitting} submitLabel={flow.kind === 'partner' ? 'Send enquiry' : 'Submit registration'} />
    </div>
  )

  return (
    <>
      <p className="rg-eyebrow rg-stepno">
        Step {step} of 3
      </p>
      <Stepper flow={flow} step={step} />
      <form noValidate onSubmit={onSubmit} className="rg-form" aria-labelledby="rg-step-title">
        <div className="rg-step" key={step}>
          <div className="rg-step__head">
            <h2 id="rg-step-title" ref={headingRef} tabIndex={-1}>
              <span className="sr-only">Step {step} of 3: </span>
              {flow.steps[step - 1]}
            </h2>
            <p>{flow.stepIntro[step - 1]}</p>
          </div>
          <ErrorSummary errors={attempted ? errors : {}} />
          {step === 1 ? step1 : step === 2 ? step2 : step3}
        </div>
      </form>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Confirmation({ flow, data, headingRef }: { flow: Flow; data: FormData; headingRef: RefObject<HTMLHeadingElement | null> }) {
  const p = flow.program
  const email = data.email.trim()
  const kind = flow.kind
  const isProgram = kind === 'children' || kind === 'event'

  const next: ReactNode[] = [
    <>
      A confirmation email is on its way to <strong>{email}</strong>.
    </>,
  ]
  if (kind === 'children') {
    next.push(<>We’ll send a reminder 2 days before the first session on Saturday, Sept 11, 2027.</>)
    next.push(<>Bring a water bottle and a snack. Sessions run 10:00am to 12:00pm at {p?.place}.</>)
  } else if (kind === 'event') {
    next.push(<>We’ll send a reminder 2 days before {p?.date}.</>)
    next.push(<>Just give your name at the welcome table. No ticket needed.</>)
  } else if (kind === 'volunteer') {
    next.push(<>A volunteer coordinator will contact you within 1 week.</>)
    next.push(<>You’ll be invited to a short, friendly orientation before your first shift.</>)
  } else if (kind === 'newcomer') {
    next.push(<>A NICANS volunteer will contact you within 1 week to say hello.</>)
    next.push(
      <>
        In the meantime, our <Link to={`${NC}/newcomers`}>newcomer guide</Link> walks you through your first weeks.
      </>,
    )
  } else if (kind === 'member') {
    next.push(<>Our membership team will review your request and reply within 2 weeks.</>)
    next.push(<>You’ll hear about programs and events in our community newsletter.</>)
  } else {
    next.push(<>Our partnerships lead will reply within 2 weeks.</>)
  }

  const addToCalendar = () => {
    if (!p) return
    const date = parseDisplayDate(p.date)
    if (!date) return
    const children = kind === 'children'
    const ics = buildIcs({
      uid: `${p.slug}-${Date.now()}`,
      title: `NICANS: ${p.name}`,
      description: `${p.blurb}\nRegistered as ${fullName(data)}.`,
      location: p.place,
      date: children ? [2027, 9, 12] : date,
      startHour: children ? 10 : 12,
      endHour: children ? 12 : 14,
    })
    downloadIcs(`nicans-${p.slug}.ics`, ics)
  }

  const title =
    kind === 'children'
      ? data.children.length > 1
        ? `Your ${data.children.length} children are registered for ${p?.name}.`
        : `${data.children[0]?.firstName.trim() || 'Your child'} is registered for ${p?.name}.`
      : kind === 'event'
        ? `See you at ${p?.name}.`
        : kind === 'volunteer'
          ? 'Your volunteer application has been received.'
          : kind === 'newcomer'
            ? 'Your request to meet a volunteer has been received.'
            : kind === 'member'
              ? 'Your membership request has been received.'
              : 'Your partnership enquiry has been received.'

  return (
    <div className="rg-confirm">
      <div className="rg-confirm__icon" aria-hidden="true">
        <CheckCircle size={56} weight="fill" />
      </div>
      <p className="rg-eyebrow">{kind === 'partner' || kind === 'member' ? 'Request sent' : 'Registration confirmed'}</p>
      <h2 ref={headingRef} tabIndex={-1}>
        {flow.confirmTitle}
      </h2>
      <p className="rg-confirm__lead">{title}</p>

      <div className="rg-card rg-next">
        <h3>What happens next</h3>
        <ol>
          {next.map((n, i) => (
            <li key={i}>
              <span className="rg-next__dot" aria-hidden="true">
                <Check size={12} weight="bold" />
              </span>
              <span>{n}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rg-confirm__actions">
        {isProgram && (
          <button type="button" className="nc-btn nc-btn--primary" onClick={addToCalendar}>
            <CalendarPlus size={20} aria-hidden="true" />
            Add to calendar
          </button>
        )}
        <Link to={NC} className="nc-btn nc-btn--outline">
          <span className="nc-studs" aria-hidden="true" />
          Back to home
        </Link>
      </div>
      <Link to={`${NC}/dashboard`} className="rg-dash-link">
        See it arrive in the volunteer dashboard <ArrowRight size={14} weight="bold" aria-hidden="true" />
      </Link>
    </div>
  )
}

/* ------------------------------------------------------------------ */

export default function Register() {
  const [params] = useSearchParams()
  const flow = resolveFlow(params)
  return (
    <NicansLayout>
      <div className="rg">
        <div className="rg-wrap">
          <header className="rg-head">
            <p className="rg-eyebrow rg-head__eyebrow">{flow.program ? flow.program.audience : 'Get involved'}</p>
            <h1>{flow.title}</h1>
            {flow.program && (
              <ul className="rg-meta">
                <li>
                  <CalendarBlank size={16} aria-hidden="true" />
                  {flow.program.date}
                </li>
                <li>
                  <Clock size={16} aria-hidden="true" />
                  {flow.kind === 'children' ? '10:00am – 12:00pm' : flow.program.time}
                </li>
                <li>
                  <MapPin size={16} aria-hidden="true" />
                  {flow.program.place}
                </li>
              </ul>
            )}
          </header>
          <RegistrationFlow key={flow.key} flow={flow} />
        </div>
      </div>
    </NicansLayout>
  )
}
