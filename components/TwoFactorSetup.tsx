'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface TwoFactorSetupProps {
  secret: string
  onVerify: (token: string) => Promise<boolean>
}

export function TwoFactorSetup({ secret, onVerify }: TwoFactorSetupProps) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await onVerify(token)
    if (isValid) {
      // Handle successful verification
    } else {
      setError('Invalid token. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Set up Two-Factor Authentication</h2>
      <div className="mb-4">
        <QRCodeSVG value={`otpauth://totp/Tradesnapper:${secret}?secret=${secret}&issuer=Tradesnapper`} />
      </div>
      <p className="mb-4">Scan this QR code with your authenticator app, or enter this secret manually: {secret}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter 6-digit code"
          className="w-full px-3 py-2 border rounded-md"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md">
          Verify
        </button>
      </form>
    </div>
  )
}

