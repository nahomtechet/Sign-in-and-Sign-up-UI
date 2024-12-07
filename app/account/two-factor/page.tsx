'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TwoFactorSetup } from '@/components/TwoFactorSetup'
import { enableTwoFactor, disableTwoFactor } from './actions'

export default function TwoFactorPage() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [secret, setSecret] = useState('')
  const router = useRouter()

  const handleEnableTwoFactor = async () => {
    const result = await enableTwoFactor()
    if (result.success) {
      setSecret(result.secret)
      setIsEnabled(true)
    }
  }

  const handleDisableTwoFactor = async () => {
    const result = await disableTwoFactor()
    if (result.success) {
      setIsEnabled(false)
      setSecret('')
    }
  }

  const handleVerify = async (token: string) => {
    // Implement verification logic here
    // If successful, redirect to account page
    router.push('/account')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Two-Factor Authentication</h1>
      {!isEnabled ? (
        <button
          onClick={handleEnableTwoFactor}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enable Two-Factor Authentication
        </button>
      ) : (
        <>
          <TwoFactorSetup secret={secret} onVerify={handleVerify} />
          <button
            onClick={handleDisableTwoFactor}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Disable Two-Factor Authentication
          </button>
        </>
      )}
    </div>
  )
}

