// lib/skills.ts

export interface Skill {
  name: string
  icon: string        // react-icons key
  category: 'frontend' | 'backend' | 'tools' | 'devops'
  level: 'expert' | 'advanced' | 'intermediate'
}

export const skills: Skill[] = [
  // Frontend
  { name: 'React', icon: 'SiReact', category: 'frontend', level: 'expert' },
  { name: 'Next.js', icon: 'SiNextdotjs', category: 'frontend', level: 'expert' },
  { name: 'TypeScript', icon: 'SiTypescript', category: 'frontend', level: 'expert' },
  { name: 'Tailwind CSS', icon: 'SiTailwindcss', category: 'frontend', level: 'expert' },
  { name: 'Framer Motion', icon: 'SiFramer', category: 'frontend', level: 'advanced' },
  { name: 'HTML5', icon: 'SiHtml5', category: 'frontend', level: 'expert' },
  { name: 'CSS3', icon: 'SiCss3', category: 'frontend', level: 'expert' },
  // Backend
  { name: 'Node.js', icon: 'SiNodedotjs', category: 'backend', level: 'advanced' },
  { name: 'Express', icon: 'SiExpress', category: 'backend', level: 'advanced' },
  { name: 'PostgreSQL', icon: 'SiPostgresql', category: 'backend', level: 'advanced' },
  { name: 'Prisma', icon: 'SiPrisma', category: 'backend', level: 'intermediate' },
  { name: 'REST API', icon: 'SiPostman', category: 'backend', level: 'advanced' },
  // Tools
  { name: 'Git', icon: 'SiGit', category: 'tools', level: 'expert' },
  { name: 'VS Code', icon: 'SiVisualstudiocode', category: 'tools', level: 'expert' },
  { name: 'Figma', icon: 'SiFigma', category: 'tools', level: 'intermediate' },
  // DevOps
  { name: 'Vercel', icon: 'SiVercel', category: 'devops', level: 'advanced' },
  { name: 'GitHub Actions', icon: 'SiGithubactions', category: 'devops', level: 'intermediate' },
  { name: 'Docker', icon: 'SiDocker', category: 'devops', level: 'intermediate' },
]

export const skillCategories = [
  { key: 'frontend', label: 'Front-end' },
  { key: 'backend', label: 'Back-end' },
  { key: 'tools', label: 'Tools' },
  { key: 'devops', label: 'DevOps' },
] as const
