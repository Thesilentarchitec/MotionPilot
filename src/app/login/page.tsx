'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the confirmation link.')
    setLoading(false)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) setMessage(error.message)
    else window.location.href = '/'
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white font-mono">
      <div className="w-full max-w-md p-8 space-y-8 border-0.5 border-white/10 bg-secondary">
        <h1 className="text-2xl font-serif text-center uppercase tracking-widest">MotionPilot Auth</h1>
        
        <form className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-black border-0.5 border-white/20 focus:border-white outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-black border-0.5 border-white/20 focus:border-white outline-none transition-colors"
              required
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="btn flex-1 border-white text-white hover:bg-white hover:text-black"
            >
              Sign In
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="btn flex-1"
            >
              Sign Up
            </button>
          </div>
        </form>
        
        {message && <p className="text-[10px] text-center uppercase tracking-widest opacity-50">{message}</p>}
      </div>
    </div>
  )
}
