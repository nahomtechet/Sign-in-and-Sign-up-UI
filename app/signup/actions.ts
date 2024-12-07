'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { sendVerificationEmail } from '@/utils/email'

const prisma = new PrismaClient()

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})


export async function signUp(prevState: any, formData: FormData) {
  const validatedFields = signUpSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return {
      errors: { email: ['User with this email already exists'] },
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Generate verification token
  const verificationToken = generateVerificationToken()

  // Create user
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verificationToken,
    },
  })

  // Send verification email
  await sendVerificationEmail(email, verificationToken)

  return {
    message: 'Account created successfully! Please check your email to verify your account.',
  }
}

function generateVerificationToken() {
  // Implement token generation logic
  return 'generated-verification-token'
}

