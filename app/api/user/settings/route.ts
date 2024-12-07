import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import logger from '@/utils/logger'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        username: true,
        email: true,
        emailVerified: true,
        twoFactorEnabled: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    logger.error('Error fetching user settings', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { username } = body

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { username },
      select: {
        username: true,
        email: true,
        emailVerified: true,
        twoFactorEnabled: true,
      },
    })

    logger.info('User settings updated', { userId: session.user.id })

    return NextResponse.json(updatedUser)
  } catch (error) {
    logger.error('Error updating user settings', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

