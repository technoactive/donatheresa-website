'use client'

import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition, use } from 'react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({ email: '', password: '' })
  
  // Unwrap searchParams using React.use()
  const resolvedSearchParams = use(searchParams)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await login(formData)
    })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Dona Theresa
          </h1>
          <p className="text-slate-600">
            Restaurant Management System
          </p>
        </div>

        {/* Messages */}
        {resolvedSearchParams?.message && (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>{resolvedSearchParams.message}</AlertDescription>
          </Alert>
        )}

        {resolvedSearchParams?.error && (
          <Alert variant="destructive">
            <AlertDescription>{resolvedSearchParams.error}</AlertDescription>
          </Alert>
        )}

        <Card className={isPending ? "opacity-90" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              Sign In
            </CardTitle>
            <CardDescription>
              {isPending 
                ? "Please wait while we authenticate your credentials..."
                : "Enter your credentials to access the dashboard"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isPending}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={isPending}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
              
              {isPending && (
                <div className="text-center text-sm text-slate-600">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Authenticating with Supabase...
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="ghost" size="sm" disabled={isPending}>
            <Link href="/" className={isPending ? "pointer-events-none opacity-50" : ""}>
              ← Back to Restaurant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 