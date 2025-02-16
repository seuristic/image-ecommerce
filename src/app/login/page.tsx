'use client'

import * as React from 'react'
import { withAuthRedirect } from '@/hocs/withAuthRedirect'
import LoginForm from '@/components/LoginForm'

function Login() {
  return <LoginForm />
}

export default withAuthRedirect(Login)
