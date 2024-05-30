'use client'
import { signOut } from 'next-auth/react'
export default function SignOut() {
  return (
    <button
      onClick={() => signOut()}
      className="text-white text-xl font-extrabold"
    >Signout</button>
  )
}
