"use server";

import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

// In a real application, make sure prisma is reused (global scope singleton)
const prisma = new PrismaClient()

export async function getPlanAction(projectName: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  
  const proj = await prisma.project.findUnique({
    where: { name: projectName }
  });
  if (!proj) return null;

  const latestRevision = await prisma.planRevision.findFirst({
    where: { projectId: proj.id },
    orderBy: { createdAt: 'desc' }
  });
  return latestRevision ? latestRevision.content : null;
}

export async function savePlanAction(projectName: string, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

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
}
