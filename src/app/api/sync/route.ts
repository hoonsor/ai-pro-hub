import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Singleton pattern for PrismaClient in serverless
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (!process.env.SYNC_API_KEY || authHeader !== `Bearer ${process.env.SYNC_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { project, content } = await request.json()
    
    // Upsert project
    const proj = await prisma.project.upsert({
      where: { name: project },
      update: {},
      create: { name: project }
    });

    // Count existing revisions for version string
    const versionCount = await prisma.planRevision.count({
      where: { projectId: proj.id }
    })
    
    const revision = await prisma.planRevision.create({
      data: {
        version: `v${versionCount + 1}`,
        content,
        projectId: proj.id
      }
    })

    return NextResponse.json({ success: true, version: revision.version })
  } catch (error) {
    console.error("Sync API Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  if (!process.env.SYNC_API_KEY || authHeader !== `Bearer ${process.env.SYNC_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const project = searchParams.get('project')

  if (!project) {
    return NextResponse.json({ error: 'Project name is required' }, { status: 400 })
  }

  try {
    const proj = await prisma.project.findUnique({
      where: { name: project }
    })

    if (!proj) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const latestRevision = await prisma.planRevision.findFirst({
      where: { projectId: proj.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestRevision) {
      return NextResponse.json({ error: 'No revisions found for this project' }, { status: 404 })
    }

    return NextResponse.json({ success: true, version: latestRevision.version, content: latestRevision.content })
  } catch (error) {
    console.error("Sync API GET Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
