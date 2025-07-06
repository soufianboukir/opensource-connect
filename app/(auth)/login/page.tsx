import { LoginForm } from '@/components/login-form'
import React, { Suspense } from 'react'

const LoginPage = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
  )
}


export default LoginPage;