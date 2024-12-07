import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendVerificationEmail(email: string, verificationToken: string) {
  const msg = {
    to: email,
    from: 'noreply@tradesnapper.com',
    subject: 'Verify your email for Tradesnapper',
    text: `Please verify your email by clicking on this link: ${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`,
    html: `<p>Please verify your email by clicking on this link: <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}">Verify Email</a></p>`,
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Error sending verification email', error)
    throw new Error('Failed to send verification email')
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const msg = {
    to: email,
    from: 'noreply@tradesnapper.com',
    subject: 'Reset your password for Tradesnapper',
    text: `Reset your password by clicking on this link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`,
    html: `<p>Reset your password by clicking on this link: <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">Reset Password</a></p>`,
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error('Error sending password reset email', error)
    throw new Error('Failed to send password reset email')
  }
}

