'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyEmail } from './actions'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmail(token).then((result) => {
        setMessage(result.message)
      })
    }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>
        {message && (
          <div className="mt-4 text-center text-sm text-green-600">{message}</div>
        )}
      </div>
    </div>
  )
}

