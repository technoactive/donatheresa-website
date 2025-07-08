"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  AlertCircle
} from "lucide-react"
import { SettingsLayout } from "@/components/dashboard/settings-layout"
import { createClient } from "@/lib/supabase/client"

export default function UserSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Get current user
  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        setMessage({ type: 'error', text: 'Failed to load user information' })
      } finally {
        setIsLoading(false)
      }
    }

    getUser()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.charAt(0).toUpperCase()
  }

  const getDisplayName = (email: string) => {
    const localPart = email.split('@')[0]
    return localPart.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ')
  }

  if (isLoading) {
    return (
      <SettingsLayout
        title="User Settings"
        description="Manage your account and profile information"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-500">Loading user information...</div>
        </div>
      </SettingsLayout>
    )
  }

  if (!user) {
    return (
      <SettingsLayout
        title="User Settings"
        description="Manage your account and profile information"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Unable to load user information. Please try refreshing the page.</AlertDescription>
        </Alert>
      </SettingsLayout>
    )
  }

  return (
    <SettingsLayout
      title="User Settings"
      description="Manage your account and profile information"
    >
      <div className="grid gap-6 max-w-4xl">
        {/* Messages */}
        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border">
                <span className="text-xl font-semibold text-slate-700">
                  {getInitials(user.email)}
                </span>
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your account details and role information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={getDisplayName(user.email)}
                  disabled
                  className="bg-slate-50"
                />
                <p className="text-xs text-slate-500">
                  Generated from your email address
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Restaurant Admin
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Full access to all restaurant management features
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Your email address cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Last Sign In</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>
              Security information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>User ID</Label>
              <Input
                value={user.id}
                disabled
                className="bg-slate-50 font-mono text-xs"
              />
              <p className="text-xs text-slate-500">
                Your unique user identifier
              </p>
            </div>

            <div className="space-y-2">
              <Label>Email Verified</Label>
              <div className="flex items-center gap-2">
                <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                  {user.email_confirmed_at ? "Verified" : "Not Verified"}
                </Badge>
                {user.email_confirmed_at && (
                  <span className="text-xs text-slate-500">
                    on {formatDate(user.email_confirmed_at)}
                  </span>
                )}
              </div>
            </div>

            {!user.email_confirmed_at && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your email address is not verified. Some features may be limited.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Other account details and metadata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div>
                <Label className="text-xs text-slate-500 uppercase tracking-wide">Phone</Label>
                <p className="text-slate-700">{user.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 uppercase tracking-wide">Provider</Label>
                <p className="text-slate-700 capitalize">{user.app_metadata?.provider || 'Email'}</p>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 uppercase tracking-wide">Updated At</Label>
                <p className="text-slate-700">{formatDate(user.updated_at)}</p>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 uppercase tracking-wide">Authentication Method</Label>
                <p className="text-slate-700">Email & Password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  )
} 