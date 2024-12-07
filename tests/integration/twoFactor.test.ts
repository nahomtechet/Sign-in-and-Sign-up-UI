import { PrismaClient } from '@prisma/client'
import { enableTwoFactor, disableTwoFactor } from '@/app/account/two-factor/actions'
import { verifyToken } from '@/utils/twoFactor'

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
  await prisma.user.create({
    data: {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedpassword',
    },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('Two-Factor Authentication Integration', () => {
  it('should enable two-factor authentication', async () => {
    const result = await enableTwoFactor()

    expect(result.success).toBe(true)
    expect(result.secret).toBeDefined()

    const user = await prisma.user.findUnique({ where: { email: 'testuser@example.com' } })
    expect(user?.twoFactorSecret).toBe(result.secret)
    expect(user?.twoFactorEnabled).toBe(false)
  })

  it('should verify a valid two-factor token', async () => {
    const user = await prisma.user.findUnique({ where: { email: 'testuser@example.com' } })
    const secret = user?.twoFactorSecret

    if (!secret) {
      throw new Error('Two-factor secret not found')
    }

    const token = generateToken(secret)
    const isValid = verifyToken(secret, token)

    expect(isValid).toBe(true)
  })

  it('should disable two-factor authentication', async () => {
    const result = await disableTwoFactor()

    expect(result.success).toBe(true)

    const user = await prisma.user.findUnique({ where: { email: 'testuser@example.com' } })
    expect(user?.twoFactorSecret).toBeNull()
    expect(user?.twoFactorEnabled).toBe(false)
  })
})

function generateToken(secret: string): string {
  // Implement token generation for testing purposes
  // You might want to use a library like 'speakeasy' for this
  return '123456' // Placeholder
}

