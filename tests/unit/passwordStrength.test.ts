import { checkPasswordStrength, getPasswordStrengthLabel } from '@/utils/passwordStrength'

describe('passwordStrength', () => {
  describe('checkPasswordStrength', () => {
    it('should return 0 for an empty password', () => {
      expect(checkPasswordStrength('')).toBe(0)
    })

    it('should return 1 for a password with only lowercase letters', () => {
      expect(checkPasswordStrength('password')).toBe(1)
    })

    it('should return 5 for a strong password', () => {
      expect(checkPasswordStrength('StrongP@ssw0rd')).toBe(5)
    })
  })

  describe('getPasswordStrengthLabel', () => {
    it('should return "Very Weak" for strength 0', () => {
      expect(getPasswordStrengthLabel(0)).toBe('Very Weak')
    })

    it('should return "Very Strong" for strength 5', () => {
      expect(getPasswordStrengthLabel(5)).toBe('Very Strong')
    })
  })
})

