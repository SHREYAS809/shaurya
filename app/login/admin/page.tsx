'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AdminLoginPage() {
  const router = useRouter()
  const loginAdmin = useAuthStore(state => state.admin)
  const loginAdminAction = useAuthStore(state => state.loginAdmin)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await loginAdminAction(email.trim(), password.trim())
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-green-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md reveal">
        {/* Branding */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin <span className="text-gradient">Portal</span></h1>
          <p className="text-muted-foreground mt-2">Sri Shaurya Medicals Management</p>
        </div>

        <div className="glass-card rounded-[2rem] p-8 sm:p-10 border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground">Secure Login</h2>
            <p className="text-sm text-muted-foreground mt-1">Authorized personnel only</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@shaurya.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-border/50 py-6 pl-10 rounded-xl focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Access Key
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="bg-secondary/50 border-border/50 py-6 pl-10 pr-10 rounded-xl focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="btn-primary-premium w-full py-6 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : 'Enter Dashboard'}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                i
              </div>
              <p className="text-[11px] text-muted-foreground font-medium leading-tight">
                This is a secure gateway. Your connection and activities are logged for safety.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Sri Shaurya Medicals. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
