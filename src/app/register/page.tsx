'use client'

import * as React from 'react'
import { withAuthRedirect } from '@/hocs/withAuthRedirect'
import RegisterForm from '@/components/RegisterForm'

function Register() {
  return <RegisterForm />
}

export default withAuthRedirect(Register)
