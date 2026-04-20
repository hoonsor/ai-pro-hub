"use server";

import { PrismaClient } from '@prisma/client'

// Singleton pattern for PrismaClient in serverless
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getPlanAction(projectName: string) {
  try {
    const proj = await prisma.project.findUnique({
      where: { name: projectName }
    });
    if (!proj) return null;

    const latestRevision = await prisma.planRevision.findFirst({
      where: { projectId: proj.id },
      orderBy: { createdAt: 'desc' }
    });
    return latestRevision ? latestRevision.content : null;
  } catch (error) {
    console.error("getPlanAction error:", error);
    return null;
  }
}

export async function savePlanAction(projectName: string, content: string) {
  try {
    const proj = await prisma.project.upsert({
      where: { name: projectName },
      update: {},
      create: { name: projectName }
    });

    const versionCount = await prisma.planRevision.count({
      where: { projectId: proj.id }
    });

    const revision = await prisma.planRevision.create({
      data: {
        version: `v${versionCount + 1}`,
        content,
        projectId: proj.id
      }
    });

    return revision.version;
  } catch (error) {
    console.error("savePlanAction error:", error);
    throw new Error(`儲存失敗：${error instanceof Error ? error.message : String(error)}`);
  }
}
