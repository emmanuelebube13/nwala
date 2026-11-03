export type Status = 'In progress' | 'Planning' | 'Ready'

export type Workstream = {
  number: string
  title: string
  description: string
  status: Status
  progress: number
  color: string
}
