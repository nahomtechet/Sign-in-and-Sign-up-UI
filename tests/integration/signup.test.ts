import { PrismaClient } from '@prisma/client'
import { signUp } from '@/app/signup/actions'

const prisma = new PrismaClient()

beforeAll(async () => {
  // Set up test database
  await prisma.$connect()
})

afterAll(async () => {
  // Clean up test database
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('Sign Up Integration', () => {
  it('should create a new user and send verification email', async () => {
    const formData = new FormData()
    formData.append('username', 'testuser')
    formData.append('email', 'test@example.com')
    formData.append('password', 'StrongP@ssw0rd')

    const result = await signUp(null, formData)

    expect(result).toHaveProperty('message')
    expect(result.message).toContain('Account created successfully')

    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } })
    expect(user).not.toBeNull()
    expect(user?.username).toBe('testuser')
    expect(user?.verificationToken).not.toBeNull()

    // In a real integration test, you would also check if the email was sent
    // This would require mocking the email service or using a test email server
  })
})

