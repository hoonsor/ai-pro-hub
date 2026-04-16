import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
