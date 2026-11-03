import type { Workstream } from '../types/project'

export const workstreams: Workstream[] = [
  {
    number: '01',
    title: 'Shape the vision',
    description: 'Turn the big idea into a clear, shared direction for the team.',
    status: 'In progress',
    progress: 68,
    color: 'coral',
  },
  {
    number: '02',
    title: 'Build the foundation',
    description: 'Create the systems and tools that make the project possible.',
    status: 'Planning',
    progress: 32,
    color: 'blue',
  },
  {
    number: '03',
    title: 'Make it real',
    description: 'Bring the experience to life, test it, and keep improving.',
    status: 'Ready',
    progress: 8,
    color: 'yellow',
  },
]
