'use server'

import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function signIn(prevState: any, formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Here you would typically verify the user's credentials
  // For this example, we'll just simulate a successful login
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulating a failed login for demonstration purposes
  if (Math.random() > 0.5) {
    return {
      error: 'Invalid email or password',
    }
  }

  // Redirect to dashboard or home page after successful login
  // You would typically set a session or token here
  return {
    message: 'Login successful',
  }
}

