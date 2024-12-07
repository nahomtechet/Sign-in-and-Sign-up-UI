import speakeasy from 'speakeasy'

export function generateSecret() {
  return speakeasy.generateSecret({ length: 32 })
}

export function verifyToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  })
}

