import { PrismaClient } from '@prisma/client'
import { requestPasswordReset } from '@/app/reset-password/actions'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
  await prisma.user.create({
    data: {
      username: 'testresetuser',
      email: 'testresetuser@example.com',
      password: 'hashedpassword',
    },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('Password Reset Integration', () => {
  it('should generate a reset token for an existing user', async () => {
    const formData = new FormData()
    formData.append('email', 'testresetuser@example.com')

    const result = await requestPasswordReset(null, formData)

    expect(result).toHaveProperty('message')
    expect(result.message).toBe('If an account with that email exists, we've sent a password reset link.')

    const user = await prisma.user.findUnique({ where: { email: 'testresetuser@example.com' } })
    expect(user?.resetToken).not.toBeNull()
    expect(user?.resetTokenExpires).not.toBeNull()
  })

  it('should not reveal if an email does not exist', async () => {
    const formData = new FormData()
    formData.append('email', 'nonexistent@example.com')

    const result = await requestPasswordReset(null, formData)

    expect(result).toHaveProperty('message')
    expect(result.message).toBe('If an account with that email exists, we've sent a password reset link.')
  })
})

