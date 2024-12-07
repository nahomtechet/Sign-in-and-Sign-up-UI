'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { checkPasswordStrength, getPasswordStrengthLabel } from '@/utils/passwordStrength'
import { signUp } from './actions'

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const [serverState, setServerState] = useState<any>(null)
  const [password, setPassword] = useState('')
  const passwordStrength = checkPasswordStrength(password)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => formData.append(key, value))
    const result = await signUp(null, formData)
    setServerState(result)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        {serverState?.errors?._form && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{serverState.errors._form}</AlertDescription>
          </Alert>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Username"
            {...register('username')}
            error={errors.username?.message || serverState?.errors?.username?.[0]}
          />
          <Input
            label="Email address"
            {...register('email')}
            error={errors.email?.message || serverState?.errors?.email?.[0]}
          />
          <div>
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message || serverState?.errors?.password?.[0]}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-1">
              <div className="flex justify-between items-center">
                <div className="text-sm">{getPasswordStrengthLabel(passwordStrength)}</div>
                <div className="w-2/3 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-500 to-green-500"
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>
        {serverState?.message && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{serverState.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

