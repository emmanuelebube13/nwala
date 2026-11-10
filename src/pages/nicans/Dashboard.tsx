import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bell,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUpDown,
  Check,
  DotsThree,
  DownloadSimple,
  FileText,
  Heart,
  List,
  MagnifyingGlass,
  Question,
  ShieldCheck,
  SignOut,
  SquaresFour,
  Tray,
  User,
  UsersThree,
  X,
  type Icon,
} from '@phosphor-icons/react'
import NicansLayout from '../../components/nicans/NicansLayout.tsx'
import {
  loadLiveRegistrations,
  programs,
  sampleRegistrations,
  type Registration,
  type RegistrationStatus,
} from '../../data/nicans.ts'
import './dashboard.css'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type View = 'dashboard' | 'registrations' | 'volunteers' | 'members' | 'enquiries' | 'events' | 'pages'
type Period = 'week' | 'month' | 'year'
type SortKey = 'name' | 'submitted'
type SortDir = 'ascending' | 'descending'

const STATUSES: RegistrationStatus[] = ['Confirmed', 'Pending review', 'Waitlisted']
const PER_PAGE = 5
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const EVENT_PROGRAMS = new Set(programs.map((p) => p.name))

const NAV: { id: View; label: string; icon: Icon; phase2?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: SquaresFour },
  { id: 'registrations', label: 'Registrations', icon: UsersThree },
  { id: 'volunteers', label: 'Volunteers', icon: Heart },
  { id: 'members', label: 'Members', icon: User },
  { id: 'enquiries', label: 'Enquiries', icon: Tray, phase2: true },
  { id: 'events', label: 'Events', icon: CalendarBlank },
  { id: 'pages', label: 'Pages', icon: FileText, phase2: true },
]

const VIEW_TITLE: Partial<Record<View, string>> = {
  registrations: 'All registrations',
  volunteers: 'Volunteer applications',
  members: 'Membership applications',
  events: 'Event registrations',
}

const KPI: Record<Period, { reg: number; vol: number; enq: number; label: string }> = {
  week: { reg: 14, vol: 5, enq: 3, label: 'this week' },
  month: { reg: 52, vol: 11, enq: 7, label: 'this month' },
  year: { reg: 486, vol: 64, enq: 9, label: 'this year' },
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function todayStamp(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function csvCell(value: string | number | undefined): string {
  let s = value === undefined ? '' : String(value)
  // Neutralise spreadsheet formula injection, then quote when needed.
  if (/^[=+\-@]/.test(s)) s = `'${s}`
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function downloadCsv(rows: Registration[]): void {
  const header = ['Name', 'Email', 'Program', 'Submitted', 'Status', 'Children']
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [r.name, r.email, r.program, r.submitted.slice(0, 10), r.status, r.children ?? ''].map(csvCell).join(','),
    ),
  ]
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nicans-registrations-${todayStamp()}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function normaliseLive(list: Registration[]): Registration[] {
  const seen = new Set<string>()
  return list
    .filter((r) => r && typeof r.name === 'string')
    .map((r, i) => ({
      ...r,
      id: r.id ? `live-${r.id}` : `live-${i}`,
      email: r.email ?? '',
      program: r.program || 'General',
      submitted: r.submitted || new Date().toISOString(),
      status: STATUSES.includes(r.status) ? r.status : 'Pending review',
      live: true,
    }))
    .filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)))
}

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0)
  const current = useRef(0)
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const from = current.current
    const span = reduce ? 0 : duration
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min(1, (now - start) / span)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = Math.round(from + (target - from) * eased)
      current.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

/** Close a popover on outside click or Escape; Escape returns focus to the trigger. */
function useDismiss(
  open: boolean,
  close: () => void,
  rootRef: RefObject<HTMLElement | null>,
  triggerRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        triggerRef?.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close, rootRef, triggerRef])
}

/** Arrow-key roving focus for role="menu" lists. */
function menuKeys(e: ReactKeyboardEvent<HTMLElement>) {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'))
  if (!items.length) return
  e.preventDefault()
  const i = items.indexOf(document.activeElement as HTMLElement)
  let next = 0
  if (e.key === 'ArrowDown') next = (i + 1) % items.length
  if (e.key === 'ArrowUp') next = (i - 1 + items.length) % items.length
  if (e.key === 'End') next = items.length - 1
  items[next].focus()
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function StatusChip({ status }: { status: RegistrationStatus }) {
  const cls = status === 'Confirmed' ? 'ok' : status === 'Pending review' ? 'pending' : 'wait'
  return <span className={`db-chip db-chip--${cls}`}>{status}</span>
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  icon,
  className = '',
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={`db-select${icon ? ' db-select--icon' : ''} ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {icon && <span className="db-select__icon" aria-hidden="true">{icon}</span>}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <CaretDown className="db-select__caret" size={14} weight="bold" aria-hidden="true" />
    </div>
  )
}

function KpiCard({
  label,
  value,
  sub,
  icon: IconCmp,
  highlight,
  children,
}: {
  label: string
  value?: number
  sub: string
  icon: Icon
  highlight?: boolean
  children?: ReactNode
}) {
  const shown = useCountUp(value ?? 0)
  return (
    <article className={`db-card db-kpi${highlight ? ' db-kpi--highlight' : ''}`}>
      <div className="db-kpi__top">
        <h2 className="db-kpi__label">{label}</h2>
        <IconCmp size={20} aria-hidden="true" />
      </div>
      {value !== undefined ? (
        <p className="db-kpi__value">
          <span aria-hidden="true">{shown}</span>
          <span className="sr-only">{value}</span>
        </p>
      ) : (
        children
      )}
      <p className="db-kpi__sub">{sub}</p>
    </article>
  )
}

function RowMenu({
  row,
  open,
  onToggle,
  onClose,
  onSet,
  up,
}: {
  row: Registration
  open: boolean
  onToggle: () => void
  onClose: () => void
  onSet: (s: RegistrationStatus) => void
  up: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  useDismiss(open, onClose, root, trigger)
  useEffect(() => {
    if (open) menu.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [open])

  const items: { status: RegistrationStatus; label: string }[] = [
    { status: 'Confirmed', label: 'Mark as confirmed' },
    { status: 'Pending review', label: 'Mark as pending' },
    { status: 'Waitlisted', label: 'Waitlist' },
  ]
  return (
    <div className="db-rowmenu" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="db-iconbtn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
      >
        <DotsThree size={20} weight="bold" aria-hidden="true" />
        <span className="sr-only">Actions for {row.name}</span>
      </button>
      {open && (
        <div
          ref={menu}
          role="menu"
          aria-label={`Actions for ${row.name}`}
          className={`db-menu db-menu--right${up ? ' db-menu--up' : ''}`}
          onKeyDown={menuKeys}
        >
          {items.map((it) => (
            <button
              key={it.status}
              type="button"
              role="menuitem"
              className="db-menu__item"
              onClick={() => {
                onSet(it.status)
                onClose()
                trigger.current?.focus()
              }}
            >
              <span className="db-menu__check" aria-hidden="true">
                {row.status === it.status && <Check size={14} weight="bold" />}
              </span>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const [view, setView] = useState<View>('dashboard')
  const [period, setPeriod] = useState<Period>('week')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifRead, setNotifRead] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)

  const [live, setLive] = useState<Registration[]>(() => normaliseLive(loadLiveRegistrations()))
  const [overrides, setOverrides] = useState<Record<string, RegistrationStatus>>({})
  const [query, setQuery] = useState('')
  const [program, setProgram] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [menuFor, setMenuFor] = useState<string | null>(null)

  const tableRef = useRef<HTMLElement>(null)
  const headCheck = useRef<HTMLInputElement>(null)
  const notifRoot = useRef<HTMLDivElement>(null)
  const notifBtn = useRef<HTMLButtonElement>(null)
  const userRoot = useRef<HTMLDivElement>(null)
  const userBtn = useRef<HTMLButtonElement>(null)
  const drawerBtn = useRef<HTMLButtonElement>(null)
  const userMenu = useRef<HTMLDivElement>(null)
  const sidebarClose = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (userOpen) userMenu.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [userOpen])
  useEffect(() => {
    if (drawerOpen) sidebarClose.current?.focus()
  }, [drawerOpen])

  const notify = useCallback((msg: string) => setToast({ id: Date.now(), msg }), [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(t)
  }, [toast])

  // Pick up registrations made in another tab (Register demo) without a reload.
  useEffect(() => {
    const refresh = () => setLive(normaliseLive(loadLiveRegistrations()))
    const onVis = () => document.visibilityState === 'visible' && refresh()
    window.addEventListener('storage', refresh)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('storage', refresh)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const closeNotif = useCallback(() => setNotifOpen(false), [])
  const closeUser = useCallback(() => setUserOpen(false), [])
  const closeMenu = useCallback(() => setMenuFor(null), [])
  useDismiss(notifOpen, closeNotif, notifRoot, notifBtn)
  useDismiss(userOpen, closeUser, userRoot, userBtn)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        drawerBtn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen])

  /* ---------- data ---------- */
  const allRows = useMemo<Registration[]>(
    () => [...live, ...sampleRegistrations].map((r) => (overrides[r.id] ? { ...r, status: overrides[r.id] } : r)),
    [live, overrides],
  )

  const programOptions = useMemo(
    () => Array.from(new Set(allRows.map((r) => r.program))).sort((a, b) => a.localeCompare(b)),
    [allRows],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let rows = allRows.filter((r) => {
      if (view === 'volunteers' && r.program !== 'Volunteer program') return false
      if (view === 'members' && r.program !== 'Membership') return false
      if (view === 'events' && !EVENT_PROGRAMS.has(r.program)) return false
      if (program !== 'all' && r.program !== program) return false
      if (status !== 'all' && r.status !== status) return false
      if (q && !`${r.name} ${r.email} ${r.program}`.toLowerCase().includes(q)) return false
      return true
    })
    if (sort) {
      const m = sort.dir === 'ascending' ? 1 : -1
      rows = [...rows].sort((a, b) =>
        sort.key === 'name' ? a.name.localeCompare(b.name) * m : a.submitted.localeCompare(b.submitted) * m,
      )
    }
    return rows
  }, [allRows, view, program, status, query, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  useEffect(() => setPage(1), [query, program, status, view, sort])

  const pageIds = pageRows.map((r) => r.id)
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id))
  const someOnPage = pageIds.some((id) => selected.has(id))
  useEffect(() => {
    if (headCheck.current) headCheck.current.indeterminate = someOnPage && !allOnPage
  }, [someOnPage, allOnPage])

  const filtersActive = query !== '' || program !== 'all' || status !== 'all' || VIEW_TITLE[view] !== undefined

  /* ---------- KPIs ---------- */
  const k = KPI[period]
  const liveIriJi = live.filter((r) => r.program === 'Iri Ji celebration').length
  const regCount = k.reg + live.length
  const iriJiCount = useCountUp(112 + liveIriJi)

  const byProgram = useMemo(() => {
    const counts = new Map<string, number>()
    allRows.forEach((r) => counts.set(r.program, (counts.get(r.program) ?? 0) + 1))
    return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
  }, [allRows])
  const maxCount = Math.max(1, ...byProgram.map((p) => p.count))

  /* ---------- actions ---------- */
  function goTo(id: View) {
    const item = NAV.find((n) => n.id === id)
    setDrawerOpen(false)
    if (item?.phase2) {
      notify(`${item.label} is coming in phase 2`)
      return
    }
    setView(id)
    setSelected(new Set())
    if (id !== 'dashboard') {
      requestAnimationFrame(() => tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  function clearFilters() {
    setQuery('')
    setProgram('all')
    setStatus('all')
    if (VIEW_TITLE[view]) setView('dashboard')
  }

  function setRowStatus(ids: string[], s: RegistrationStatus) {
    setOverrides((o) => {
      const next = { ...o }
      ids.forEach((id) => (next[id] = s))
      return next
    })
  }

  function toggleSort(key: SortKey) {
    setSort((cur) => {
      if (!cur || cur.key !== key) return { key, dir: key === 'submitted' ? 'descending' : 'ascending' }
      return { key, dir: cur.dir === 'ascending' ? 'descending' : 'ascending' }
    })
  }

  function toggleRow(id: string) {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  function togglePage() {
    setSelected((s) => {
      const n = new Set(s)
      if (allOnPage) pageIds.forEach((id) => n.delete(id))
      else pageIds.forEach((id) => n.add(id))
      return n
    })
  }

  function exportRows(rows: Registration[]) {
    if (!rows.length) {
      notify('Nothing to export')
      return
    }
    downloadCsv(rows)
    notify(`Exported ${rows.length} ${rows.length === 1 ? 'row' : 'rows'}`)
  }

  const sortIcon = (key: SortKey) => {
    if (sort?.key !== key) return <CaretUpDown size={14} aria-hidden="true" />
    return sort.dir === 'ascending' ? (
      <ArrowUp size={14} weight="bold" aria-hidden="true" />
    ) : (
      <ArrowDown size={14} weight="bold" aria-hidden="true" />
    )
  }
  const ariaSort = (key: SortKey) => (sort?.key === key ? sort.dir : 'none')

  const crumb = NAV.find((n) => n.id === view)?.label ?? 'Dashboard'
  const notifCount = notifRead ? 0 : 3
  const newToday = 3 + live.length
  const selectedRows = allRows.filter((r) => selected.has(r.id))

  return (
    <NicansLayout header="none" footer={false}>
      <div className={`db${drawerOpen ? ' is-drawer-open' : ''}`}>
        {/* Mobile top bar */}
        <div className="db-mobilebar">
          <button
            ref={drawerBtn}
            type="button"
            className="db-iconbtn db-iconbtn--light"
            aria-expanded={drawerOpen}
            aria-controls="db-sidebar"
            onClick={() => setDrawerOpen(true)}
          >
            <List size={22} aria-hidden="true" />
            <span className="sr-only">Open navigation</span>
          </button>
          <span className="db-wordmark db-wordmark--small">COMMUNITY</span>
        </div>

        {drawerOpen && <div className="db-scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

        <aside id="db-sidebar" className="db-sidebar" aria-label="Workspace">
          <div className="db-sidebar__head">
            <div>
              <p className="db-wordmark">COMMUNITY</p>
              <p className="db-sidebar__tag">Management hub</p>
            </div>
            <button
              ref={sidebarClose}
              type="button"
              className="db-iconbtn db-iconbtn--light db-sidebar__close"
              onClick={() => {
                setDrawerOpen(false)
                drawerBtn.current?.focus()
              }}
            >
              <X size={20} aria-hidden="true" />
              <span className="sr-only">Close navigation</span>
            </button>
          </div>
          <nav aria-label="Management hub">
            <ul className="db-nav">
              {NAV.map(({ id, label, icon: IconCmp, phase2 }) => (
                <li key={id}>
                  <button
                    type="button"
                    className={`db-nav__item${view === id ? ' is-active' : ''}`}
                    aria-current={view === id ? 'page' : undefined}
                    onClick={() => goTo(id)}
                  >
                    <IconCmp size={20} weight={view === id ? 'fill' : 'regular'} aria-hidden="true" />
                    {label}
                    {phase2 && <span className="db-nav__soon">Soon</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="db-sidebar__foot">
            <div className="db-secure">
              <ShieldCheck size={22} weight="duotone" aria-hidden="true" />
              <p className="db-secure__title">Your workspace, secured</p>
              <p className="db-secure__sub">Administrator access</p>
            </div>
            <button type="button" className="db-help" onClick={() => notify('Support is a phase 2 feature')}>
              <Question size={20} aria-hidden="true" />
              Help &amp; support
            </button>
          </div>
        </aside>

        <div className="db-main">
          <header className="db-topbar">
            <nav aria-label="Breadcrumb" className="db-crumbs">
              <ol>
                <li>
                  <button type="button" className="db-crumbs__link" onClick={() => goTo('dashboard')}>
                    Workspace
                  </button>
                </li>
                <li aria-current="page">{crumb}</li>
              </ol>
            </nav>
            <div className="db-topbar__right">
              <span className="db-securebadge">
                <ShieldCheck size={16} aria-hidden="true" />
                Secure workspace
              </span>

              <div className="db-pop" ref={notifRoot}>
                <button
                  ref={notifBtn}
                  type="button"
                  className="db-iconbtn"
                  aria-expanded={notifOpen}
                  aria-controls="db-notifs"
                  onClick={() => setNotifOpen((o) => !o)}
                >
                  <Bell size={20} aria-hidden="true" />
                  {notifCount > 0 && <span className="db-badge" aria-hidden="true">{notifCount}</span>}
                  <span className="sr-only">
                    Notifications{notifCount > 0 ? `, ${notifCount} unread` : ''}
                  </span>
                </button>
                {notifOpen && (
                  <div id="db-notifs" className="db-popover" role="dialog" aria-label="Notifications">
                    <div className="db-popover__head">
                      <h2>Notifications</h2>
                      {notifCount > 0 && (
                        <button type="button" className="db-textbtn" onClick={() => setNotifRead(true)}>
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <ul className="db-notifs">
                      <li className={notifRead ? '' : 'is-unread'}>
                        <UsersThree size={18} aria-hidden="true" />
                        <span>
                          <strong>{newToday} new registrations</strong> today
                          <small>Just now</small>
                        </span>
                      </li>
                      <li className={notifRead ? '' : 'is-unread'}>
                        <Heart size={18} aria-hidden="true" />
                        <span>
                          <strong>Emeka Nwosu</strong> applied to volunteer
                          <small>2 hours ago</small>
                        </span>
                      </li>
                      <li className={notifRead ? '' : 'is-unread'}>
                        <Tray size={18} aria-hidden="true" />
                        <span>
                          New enquiry: <strong>hall booking for a naming ceremony</strong>
                          <small>Yesterday</small>
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="db-pop" ref={userRoot}>
                <button
                  ref={userBtn}
                  type="button"
                  className="db-user"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                  onClick={() => setUserOpen((o) => !o)}
                >
                  <User size={18} aria-hidden="true" />
                  <span>Admin</span>
                  <CaretDown size={14} weight="bold" aria-hidden="true" />
                </button>
                {userOpen && (
                  <div
                    role="menu"
                    aria-label="Account"
                    className="db-menu db-menu--right"
                    onKeyDown={menuKeys}
                    ref={userMenu}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="db-menu__item"
                      onClick={() => {
                        setUserOpen(false)
                        notify('Profile settings are coming in phase 2')
                      }}
                    >
                      <User size={16} aria-hidden="true" /> Profile settings
                    </button>
                    <Link role="menuitem" className="db-menu__item" to="/work/nicans">
                      <ArrowRight size={16} aria-hidden="true" /> Back to case study
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className="db-menu__item"
                      onClick={() => {
                        setUserOpen(false)
                        notify('Demo mode: you’re staying signed in')
                      }}
                    >
                      <SignOut size={16} aria-hidden="true" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="db-content">
            <section className="db-hello" aria-labelledby="db-hello-title">
              <div>
                <h1 id="db-hello-title">{greeting()}, Admin</h1>
                <p>Here’s what’s happening across your community.</p>
              </div>
              <SelectField
                id="db-period"
                label="Reporting period"
                value={period}
                onChange={(v) => setPeriod(v as Period)}
                icon={<CalendarBlank size={16} />}
                className="db-select--period"
                options={[
                  { value: 'week', label: 'This week' },
                  { value: 'month', label: 'This month' },
                  { value: 'year', label: 'This year' },
                ]}
              />
            </section>

            <section className="db-kpis" aria-label={`Key numbers ${k.label}`}>
              <KpiCard
                label={`New registrations ${k.label}`}
                value={regCount}
                sub={live.length ? `Across all programs · ${live.length} from you` : 'Across all programs'}
                icon={UsersThree}
              />
              <KpiCard label="Volunteer applications" value={k.vol} sub="Ready for your review" icon={Heart} />
              <KpiCard label="Open enquiries" value={k.enq} sub="Awaiting a response" icon={Tray} />
              <KpiCard
                label="Next event"
                sub={`${iriJiCount} registered · 15 Aug 2027`}
                icon={CalendarBlank}
                highlight
              >
                <p className="db-kpi__event">Iri Ji Festival</p>
              </KpiCard>
            </section>

            <section className="db-card db-table-card" ref={tableRef} aria-labelledby="db-table-title">
              <div className="db-table-card__head">
                <div className="db-table-card__title">
                  <h2 id="db-table-title">{VIEW_TITLE[view] ?? 'Recent registrations'}</h2>
                  <span className="db-tag">Sample data</span>
                  {VIEW_TITLE[view] && (
                    <button type="button" className="db-filterchip" onClick={() => setView('dashboard')}>
                      {crumb}
                      <X size={12} weight="bold" aria-hidden="true" />
                      <span className="sr-only">Remove {crumb} filter</span>
                    </button>
                  )}
                </div>
                <button type="button" className="db-viewall" onClick={() => goTo('registrations')}>
                  View all registrations
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>

              <div className="db-controls">
                <div className="db-search">
                  <label htmlFor="db-search" className="sr-only">
                    Search registrations
                  </label>
                  <MagnifyingGlass size={18} aria-hidden="true" />
                  <input
                    id="db-search"
                    type="search"
                    placeholder="Search registrations…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div className="db-controls__right">
                  <SelectField
                    id="db-program"
                    label="Filter by program"
                    value={program}
                    onChange={setProgram}
                    options={[
                      { value: 'all', label: 'All programs' },
                      ...programOptions.map((p) => ({ value: p, label: p })),
                    ]}
                  />
                  <SelectField
                    id="db-status"
                    label="Filter by status"
                    value={status}
                    onChange={setStatus}
                    options={[{ value: 'all', label: 'All statuses' }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
                  />
                  <button type="button" className="db-export" onClick={() => exportRows(filtered)}>
                    <DownloadSimple size={18} weight="bold" aria-hidden="true" />
                    Export CSV
                  </button>
                </div>
              </div>

              {selected.size > 0 && (
                <div className="db-bulk" role="region" aria-label="Bulk actions">
                  <span>
                    <strong>{selected.size}</strong> selected
                  </span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setRowStatus([...selected], 'Confirmed')
                      notify(`${selected.size} marked as confirmed`)
                      setSelected(new Set())
                    }}
                  >
                    <Check size={14} weight="bold" aria-hidden="true" /> Confirm
                  </button>
                  <span aria-hidden="true">·</span>
                  <button type="button" onClick={() => exportRows(selectedRows)}>
                    <DownloadSimple size={14} weight="bold" aria-hidden="true" /> Export selected
                  </button>
                  <button type="button" className="db-bulk__clear" onClick={() => setSelected(new Set())}>
                    Clear selection
                  </button>
                </div>
              )}

              <table className="db-table">
                <caption className="sr-only">
                  {VIEW_TITLE[view] ?? 'Recent registrations'}, page {safePage} of {pageCount}
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="db-col-check">
                      <input
                        ref={headCheck}
                        type="checkbox"
                        checked={allOnPage}
                        onChange={togglePage}
                        disabled={pageRows.length === 0}
                        aria-label="Select all visible registrations"
                      />
                    </th>
                    <th scope="col" aria-sort={ariaSort('name')} className="db-col-name">
                      <button type="button" className="db-sort" onClick={() => toggleSort('name')}>
                        Name {sortIcon('name')}
                      </button>
                    </th>
                    <th scope="col" className="db-col-program">Program</th>
                    <th scope="col" aria-sort={ariaSort('submitted')} className="db-col-date">
                      <button type="button" className="db-sort" onClick={() => toggleSort('submitted')}>
                        Submitted {sortIcon('submitted')}
                      </button>
                    </th>
                    <th scope="col" className="db-col-status">Status</th>
                    <th scope="col" className="db-col-actions">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr className="db-empty-row">
                      <td colSpan={6}>
                        <div className="db-empty">
                          <MagnifyingGlass size={28} aria-hidden="true" />
                          <p>No registrations match.</p>
                          {filtersActive && (
                            <button type="button" className="db-textbtn" onClick={clearFilters}>
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((r, i) => (
                      <tr
                        key={r.id}
                        className={`${r.live ? 'is-live' : ''}${selected.has(r.id) ? ' is-selected' : ''}`}
                      >
                        <td className="db-col-check">
                          <input
                            type="checkbox"
                            checked={selected.has(r.id)}
                            onChange={() => toggleRow(r.id)}
                            aria-label={`Select ${r.name}`}
                          />
                        </td>
                        <th scope="row" className="db-col-name">
                          <span className="db-name">
                            {r.name}
                            {r.live && <span className="db-new">New</span>}
                          </span>
                          <span className="db-email">
                            {r.email.includes('@') ? (
                              <>
                                {r.email.slice(0, r.email.indexOf('@'))}
                                <wbr />
                                {r.email.slice(r.email.indexOf('@'))}
                              </>
                            ) : (
                              r.email
                            )}
                          </span>
                        </th>
                        <td className="db-col-program">
                          <span className="db-mlabel">Program</span>
                          {r.program}
                        </td>
                        <td className="db-col-date">
                          <span className="db-mlabel">Submitted</span>
                          <time dateTime={r.submitted.slice(0, 10)}>{formatDate(r.submitted)}</time>
                        </td>
                        <td className="db-col-status">
                          <StatusChip status={r.status} />
                        </td>
                        <td className="db-col-actions">
                          <RowMenu
                            row={r}
                            open={menuFor === r.id}
                            onToggle={() => setMenuFor((m) => (m === r.id ? null : r.id))}
                            onClose={closeMenu}
                            up={pageRows.length > 3 && i >= pageRows.length - 2}
                            onSet={(s) => {
                              setRowStatus([r.id], s)
                              notify(`Status updated: ${r.name} is ${s.toLowerCase()}`)
                            }}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="db-pager">
                <p aria-live="polite">
                  Showing {pageRows.length} of {filtered.length} registrations
                </p>
                <nav aria-label="Pagination" className="db-pager__nav">
                  <button
                    type="button"
                    className="db-iconbtn"
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}
                  >
                    <CaretLeft size={16} weight="bold" aria-hidden="true" />
                    <span className="sr-only">Previous page</span>
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`db-pagebtn${n === safePage ? ' is-current' : ''}`}
                      aria-current={n === safePage ? 'page' : undefined}
                      onClick={() => setPage(n)}
                    >
                      <span className="sr-only">Page </span>
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="db-iconbtn"
                    disabled={safePage === pageCount}
                    onClick={() => setPage(safePage + 1)}
                  >
                    <CaretRight size={16} weight="bold" aria-hidden="true" />
                    <span className="sr-only">Next page</span>
                  </button>
                </nav>
              </div>
            </section>

            <div className="db-insights">
              <section className="db-card db-chart" aria-labelledby="db-chart-title">
                <div className="db-card__head">
                  <h2 id="db-chart-title">Registrations by program</h2>
                  <span className="db-tag">{allRows.length} total</span>
                </div>
                <ul className="db-bars">
                  {byProgram.map((p) => (
                    <li key={p.name}>
                      <span className="db-bars__label">{p.name}</span>
                      <span className="db-bars__track" aria-hidden="true">
                        <span className="db-bars__fill" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                      </span>
                      <span className="db-bars__value">{p.count}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="db-card db-upcoming" aria-labelledby="db-upcoming-title">
                <div className="db-card__head">
                  <h2 id="db-upcoming-title">Upcoming programs</h2>
                </div>
                <ul>
                  {programs.map((p) => (
                    <li key={p.slug}>
                      <span className="db-upcoming__dot" aria-hidden="true" />
                      <span>
                        <strong>{p.name}</strong>
                        <small>
                          {p.date} · {p.audience}
                        </small>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="db-explainers" aria-label="Why this hub">
              {[
                ['01', 'One place for everything', 'All forms in one place, no more spreadsheets'],
                ['02', 'Reporting, made simple', 'One-click export for board and funder reports'],
                ['03', 'The right access for every role', 'Role-based access: volunteers see only what they need'],
              ].map(([n, t, d]) => (
                <article key={n} className="db-card db-explainer">
                  <span className="db-explainer__num" aria-hidden="true">
                    {n}
                  </span>
                  <div>
                    <h2>{t}</h2>
                    <p>{d}</p>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>

        <div className="db-toast-region" role="status" aria-live="polite">
          {toast && (
            <div key={toast.id} className="db-toast">
              <Check size={16} weight="bold" aria-hidden="true" />
              {toast.msg}
            </div>
          )}
        </div>
      </div>
    </NicansLayout>
  )
}
