"use client"

import * as React from "react"
import { useState, useEffect, useTransition } from "react"
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
  AlertCircle,
  Lock,
  Edit,
  Loader2
} from "lucide-react"
import { SettingsLayout } from "@/components/dashboard/settings-layout"
import { createClient } from "@/lib/supabase/client"
import { updateUserProfile, changePassword } from "./actions"

interface UserProfile {
  display_name?: string
  avatar_url?: string
  phone?: string
}

export default function UserSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // Form states
  const [displayName, setDisplayName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  // Loading states
  const [isUpdatingProfile, startProfileTransition] = useTransition()
  const [isChangingPassword, startPasswordTransition] = useTransition()

  // Get current user and profile
  useEffect(() => {
    const supabase = createClient()
    
    const getUserAndProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        
        setUser(user)

        if (user) {
          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError)
                     } else if (profileData) {
             setProfile(profileData)
             setDisplayName(profileData.display_name || getDisplayName(user.email || ''))
           } else {
             setDisplayName(getDisplayName(user.email || ''))
           }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setMessage({ type: 'error', text: 'Failed to load user information' })
      } finally {
        setIsLoading(false)
      }
    }

    getUserAndProfile()
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

  const getCurrentDisplayName = () => {
    return profile?.display_name || getDisplayName(user?.email || '')
  }

  const handleUpdateProfile = async (formData: FormData) => {
    startProfileTransition(async () => {
      const result = await updateUserProfile(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Profile updated successfully!' })
        setIsEditingName(false)
        // Refresh profile data
        const supabase = createClient()
        if (user) {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()
          
          if (profileData) {
            setProfile(profileData)
          }
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    })
  }

  const handleChangePassword = async (formData: FormData) => {
    startPasswordTransition(async () => {
      const result = await changePassword(formData)
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Password changed successfully!' })
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: ""
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    })
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
                {isEditingName ? (
                  <form action={handleUpdateProfile} className="space-y-2">
                    <Input
                      id="display-name"
                      name="display_name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                      disabled={isUpdatingProfile}
                      required
                    />
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        size="sm"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsEditingName(false)
                          setDisplayName(getCurrentDisplayName())
                        }}
                        disabled={isUpdatingProfile}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={getCurrentDisplayName()}
                      disabled
                      className="bg-slate-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  {profile?.display_name ? 'Your custom display name' : 'Generated from your email address'}
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

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password for security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                  placeholder="Enter your current password"
                  disabled={isChangingPassword}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    placeholder="Enter new password"
                    disabled={isChangingPassword}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-slate-500">
                    At least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                    placeholder="Confirm new password"
                    disabled={isChangingPassword}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isChangingPassword}
                className="w-full md:w-auto"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
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
                <p className="text-slate-700">{profile?.phone || user.phone || 'Not provided'}</p>
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