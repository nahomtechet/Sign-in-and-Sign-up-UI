'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/utils/email'
import logger from '@/utils/logger'

const prisma = new PrismaClient()

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function requestPasswordReset(prevState: any, formData: FormData) {
  try {
    const validatedFields = resetPasswordSchema.safeParse({
      email: formData.get('email'),
    })

    if (!validatedFields.success) {
      logger.warn('Password reset request validation failed', { errors: validatedFields.error.flatten().fieldErrors })
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { email } = validatedFields.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      logger.info('Password reset requested for non-existent email', { email })
      return {
        message: 'If an account with that email exists, we\'ve sent a password reset link.',
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires },
    })

    await sendPasswordResetEmail(email, resetToken)

    logger.info('Password reset requested', { userId: user.id, email: user.email })

    return {
      message: 'If an account with that email exists, we\'ve sent a password reset link.',
    }
  } catch (error) {
    logger.error('Error during password reset request', { error })
    return {
      errors: { _form: ['An unexpected error occurred. Please try again later.'] },
    }
  }
}

