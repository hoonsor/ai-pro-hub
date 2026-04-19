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

// ─── 初始資料 Hook：只載入 projects (18KB) + tag_counts (484B) ──────────────
// 不阻塞任何技能資料，瞬間完成
export function useInitialData() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/data/projects.json").then(r => r.ok ? r.json() : Promise.reject("projects failed")),
      fetch("/data/tag_counts.json").then(r => r.ok ? r.json() : Promise.resolve({})),
    ])
      .then(([proj, counts]) => {
        setProjects(proj.projects || [])
        setTagCounts(counts || {})
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to load initial data:", err)
        setError(String(err))
        setLoading(false)
      })
  }, [])

  return { projects, tagCounts, loading, error }
}

// ─── 技能懶載入 Hook：只有 enabled=true 時才 fetch skills_slim.json (577KB) ──
export function useSkillsData(enabled: boolean) {
  const [skills, setSkills] = useState<SkillData[]>([])
  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!enabled || loaded) return
    setLoading(true)
    fetch("/data/skills_slim.json")
      .then(r => r.ok ? r.json() : Promise.reject("skills failed"))
      .then(json => {
        setSkills(json.skills || [])
        setWorkflows(json.workflows || [])
        setLoading(false)
        setLoaded(true)
      })
      .catch(() => {
        setLoading(false)
        setLoaded(true)
      })
  }, [enabled, loaded])

  return { skills, workflows, loading, loaded }
}

// ─── 舊版 combined hook（向下相容，供 DashboardOverview 等使用）──────────────
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
    Promise.all([
      fetch("/data/projects.json").then(r => r.json()),
      fetch("/data/skills_slim.json").then(r => r.json()),
    ])
      .then(([pj, sj]) => {
        setData({
          projects: pj.projects || [],
          skills: sj.skills || [],
          workflows: sj.workflows || [],
          tagIndex: sj.tag_index || {},
          loading: false,
          error: null,
        })
      })
      .catch(err => {
        setData(prev => ({ ...prev, loading: false, error: String(err) }))
      })
  }, [])

  return data
}

// ─── 舊版 alias（向下相容）────────────────────────────────────────────────────
export function useProjectsData() {
  const { projects, loading, error } = useInitialData()
  return { projects, loading, error }
}
