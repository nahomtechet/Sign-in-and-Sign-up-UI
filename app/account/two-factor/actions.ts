'use server'

import { PrismaClient } from '@prisma/client'
import { generateSecret } from '@/utils/twoFactor'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import logger from '@/utils/logger'

const prisma = new PrismaClient()

export async function enableTwoFactor() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error('User not authenticated')
    }

    const secret = generateSecret()

    await prisma.user.update({
      where: { email: session.user.email },
      data: { twoFactorSecret: secret.base32, twoFactorEnabled: false },
    })

    logger.info('Two-factor authentication enabled', { userId: session.user.id })

    return { success: true, secret: secret.base32 }
  } catch (error) {
    logger.error('Error enabling two-factor authentication', { error })
    return { success: false, error: 'Failed to enable two-factor authentication' }
  }
}

export async function disableTwoFactor() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new Error('User not authenticated')
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: { twoFactorSecret: null, twoFactorEnabled: false },
    })

    logger.info('Two-factor authentication disabled', { userId: session.user.id })

    return { success: true }
  } catch (error) {
    logger.error('Error disabling two-factor authentication', { error })
    return { success: false, error: 'Failed to disable two-factor authentication' }
  }
}

