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
          fetch("/data/skills.json"),
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
        console.warn("Failed to fetch dynamically, ensure /data exists:", err)
        setData((prev) => ({ ...prev, loading: false, error: err.message }))
      }
    }

    fetchData()
  }, [])

  return data
}
