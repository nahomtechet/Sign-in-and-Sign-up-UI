'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({ where: { verificationToken: token } })

  if (!user) {
    return { message: 'Invalid verification token' }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null },
  })

  return { message: 'Email verified successfully. You can now log in.' }
}

