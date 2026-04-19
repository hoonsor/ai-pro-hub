import { useState, useEffect } from "react"

export interface TaskItem {
  title: string
  completed: boolean
}

export interface CommitItem {
  hash: string
  date: string
  message: string
}

export interface ChangelogItem {
  version: string
  date: string
  type: string
  description: string
}

export interface ProjectData {
  id?: string
  name: string
  version: string
  github_url?: string
  has_git: boolean
  tech_stack: string[]
  description?: string
  changelog?: ChangelogItem[]
  recent_commits?: CommitItem[]
  revision_history?: any[]
  last_scanned?: string
  tasks?: {
    main: TaskItem[]
    sub: TaskItem[]
    deprecated?: any[]
  }
}

export interface SkillData {
  name: string
  display_name: string
  description: string
  summary: string
  tags: string[]
}

export interface WorkflowData {
  name: string
  display_name: string
  content: string
}

// ─── Projects-only hook (loads immediately, very fast 18KB) ──────────────────
export function useProjectsData() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/projects.json")
      .then(r => { if (!r.ok) throw new Error("Failed to load projects"); return r.json() })
      .then(json => { setProjects(json.projects || []); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return { projects, loading, error }
}

// ─── Skills lazy hook (only fetches when enabled=true) ───────────────────────
export function useSkillsData(enabled: boolean) {
  const [skills, setSkills] = useState<SkillData[]>([])
  const [tagIndex, setTagIndex] = useState<Record<string, string[]>>({})
  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!enabled || loaded) return
    setLoading(true)
    fetch("/data/skills_slim.json")
      .then(r => { if (!r.ok) throw new Error("Failed to load skills"); return r.json() })
      .then(json => {
        setSkills(json.skills || [])
        setTagIndex(json.tag_index || {})
        setWorkflows(json.workflows || [])
        setLoading(false)
        setLoaded(true)
      })
      .catch(() => { setLoading(false); setLoaded(true) })
  }, [enabled, loaded])

  return { skills, tagIndex, workflows, loading }
}

// ─── Combined hook (backward compat, used by DashboardOverview) ──────────────
export interface DashboardData {
  projects: ProjectData[]
  skills: SkillData[]
  workflows: WorkflowData[]
  tagIndex: Record<string, string[]>
  loading: boolean
  error: string | null
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    skills: [],
    workflows: [],
    tagIndex: {},
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          fetch("/data/projects.json"),
          fetch("/data/skills_slim.json"),
        ])

        if (!projectsRes.ok || !skillsRes.ok) {
          throw new Error("Failed to load JSON data")
        }

        const projectsJson = await projectsRes.json()
        const skillsJson = await skillsRes.json()

        setData({
          projects: projectsJson.projects || [],
          skills: skillsJson.skills || [],
          workflows: skillsJson.workflows || [],
          tagIndex: skillsJson.tag_index || {},
          loading: false,
          error: null,
        })
      } catch (err: any) {
        console.warn("Failed to fetch dynamically:", err)
        setData((prev) => ({ ...prev, loading: false, error: err.message }))
      }
    }

    fetchData()
  }, [])

  return data
}
