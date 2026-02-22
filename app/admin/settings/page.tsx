'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft, Save, Bell, Lock, Users, Shield, CheckCircle, AlertCircle,
  Globe, Moon, SunMedium, Database, RefreshCw, Loader2, Wifi
} from 'lucide-react'

const API_URL = 'http://localhost:8000'

export default function AdminSettingsPage() {
  const router = useRouter()
  const admin = useAuthStore(state => state.admin)
  const [isHydrated, setIsHydrated] = useState(false)

  // Profile
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Notifications
  const [notifPrefs, setNotifPrefs] = useState({
    newOrders: true,
    lowStock: true,
    customerReviews: false,
    dailyReports: true,
    weeklyAnalytics: false,
    securityAlerts: true,
  })
  const [notifSaved, setNotifSaved] = useState(false)

  // System
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => { setIsHydrated(true) }, [])

  useEffect(() => {
    if (isHydrated && !admin) router.push('/login/admin')
    if (admin) {
      setName(admin.name || '')
      setPhone(admin.phone || '')
    }
  }, [admin, isHydrated, router])

  // Check API / DB status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch(`${API_URL}/`)
        if (res.ok) {
          setApiStatus('online')
          setDbStatus('online')
        } else {
          setApiStatus('offline')
          setDbStatus('offline')
        }
      } catch {
        setApiStatus('offline')
        setDbStatus('offline')
      }
    }
    checkStatus()
  }, [])

  if (!isHydrated || !admin) return null

  const handleSaveProfile = async () => {
    setProfileSaving(true)
    setProfileMsg(null)
    try {
      const res = await fetch(`${API_URL}/auth/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: admin.id,
          password: '', // empty = don't change password
          name: name.trim(),
          phone: phone.trim()
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to save profile')
      }
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message })
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword) return setPasswordMsg({ type: 'error', text: 'Please enter a new password.' })
    if (newPassword !== confirmPassword) return setPasswordMsg({ type: 'error', text: 'Passwords do not match.' })
    if (newPassword.length < 8) return setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters.' })
    setPasswordSaving(true)
    setPasswordMsg(null)
    try {
      const res = await fetch(`${API_URL}/auth/update-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: admin.id,
          password: newPassword,
          name: admin.name,
          phone: admin.phone || ''
        })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to update password')
      }
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleSaveNotifications = () => {
    // Persist to localStorage for now
    localStorage.setItem('admin-notif-prefs', JSON.stringify(notifPrefs))
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 3000)
  }

  const recheckStatus = async () => {
    setApiStatus('checking')
    setDbStatus('checking')
    try {
      const res = await fetch(`${API_URL}/`)
      if (res.ok) { setApiStatus('online'); setDbStatus('online') }
      else { setApiStatus('offline'); setDbStatus('offline') }
    } catch {
      setApiStatus('offline')
      setDbStatus('offline')
    }
  }

  const statusDot = (status: 'checking' | 'online' | 'offline') => {
    if (status === 'checking') return <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
    if (status === 'online') return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
    return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
  }

  const statusText = (status: 'checking' | 'online' | 'offline', onLabel = 'Online', offLabel = 'Offline') => {
    if (status === 'checking') return <span className="text-amber-500 font-black">Checking...</span>
    if (status === 'online') return <span className="text-emerald-500 font-black">{onLabel}</span>
    return <span className="text-red-500 font-black">{offLabel}</span>
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Core <span className="text-gradient">Configuration</span></h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Settings Module</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8 reveal">

        {/* ─── Account Settings ─── */}
        <div className="glass-card rounded-[2.5rem] p-8 border-primary/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Account Identity</h2>
              <p className="text-sm text-muted-foreground">Update your admin profile information</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <Input
                value={admin.email}
                disabled
                className="h-12 rounded-2xl bg-secondary/30 border-border/30 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground/60">Email cannot be changed after account creation.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Display Name</Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Admin Name"
                  className="h-12 rounded-2xl border-primary/10 focus:border-primary/40 bg-card/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Number</Label>
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="h-12 rounded-2xl border-primary/10 focus:border-primary/40 bg-card/50"
                />
              </div>
            </div>
            {profileMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {profileMsg.text}
              </div>
            )}
            <Button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="h-12 px-8 rounded-2xl btn-primary-premium font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {profileSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>

        {/* ─── Security ─── */}
        <div className="glass-card rounded-[2.5rem] p-8 border-primary/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Security Protocol</h2>
              <p className="text-sm text-muted-foreground">Change your admin account password</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="h-12 rounded-2xl border-primary/10 focus:border-primary/40 bg-card/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="h-12 rounded-2xl border-primary/10 focus:border-primary/40 bg-card/50"
                />
              </div>
            </div>
            {passwordMsg && (
              <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {passwordMsg.text}
              </div>
            )}
            <Button
              onClick={handleChangePassword}
              disabled={passwordSaving}
              className="h-12 px-8 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center gap-2"
            >
              {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>

        {/* ─── Notifications ─── */}
        <div className="glass-card rounded-[2.5rem] p-8 border-primary/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Alert Preferences</h2>
              <p className="text-sm text-muted-foreground">Control which notifications you receive</p>
            </div>
          </div>
          <div className="space-y-3">
            {([
              { key: 'newOrders', label: 'New Orders', desc: 'Get notified when new orders are placed', color: 'bg-blue-500' },
              { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Alert when medicine stock drops below threshold', color: 'bg-red-500' },
              { key: 'customerReviews', label: 'Customer Reviews', desc: 'Notified on new customer feedback', color: 'bg-purple-500' },
              { key: 'dailyReports', label: 'Daily Reports', desc: 'Receive daily sales and activity summary', color: 'bg-emerald-500' },
              { key: 'weeklyAnalytics', label: 'Weekly Analytics', desc: 'Weekly performance metrics digest', color: 'bg-indigo-500' },
              { key: 'securityAlerts', label: 'Security Alerts', desc: 'Notify on suspicious login activity', color: 'bg-amber-500' },
            ] as const).map(({ key, label, desc, color }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/30 group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <div>
                    <p className="font-bold text-foreground text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 ${notifPrefs[key] ? 'bg-primary' : 'bg-secondary'}`}
                  aria-label={`Toggle ${label}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${notifPrefs[key] ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={handleSaveNotifications}
              className="h-12 px-8 rounded-2xl btn-primary-premium font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Save Preferences
            </Button>
            {notifSaved && (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                <CheckCircle className="w-4 h-4" />
                Saved!
              </div>
            )}
          </div>
        </div>

        {/* ─── System Information ─── */}
        <div className="glass-card rounded-[2.5rem] p-8 border-primary/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                <Database className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">System Overview</h2>
                <p className="text-sm text-muted-foreground">Platform health and environment info</p>
              </div>
            </div>
            <Button variant="outline" onClick={recheckStatus} className="rounded-2xl border-primary/20 font-bold text-primary hover:bg-primary/5 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Recheck
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Platform Version', value: 'v1.2.0', icon: Shield, color: 'text-primary' },
              { label: 'Last Updated', value: 'Feb 22, 2026', icon: Globe, color: 'text-blue-500' },
              { label: 'Environment', value: 'Development', icon: SunMedium, color: 'text-amber-500' },
              { label: 'Admin ID', value: admin.id?.slice(0, 8) + '...', icon: Lock, color: 'text-muted-foreground' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="p-4 bg-secondary/30 rounded-2xl border border-border/30 flex items-center gap-4">
                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-inner">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{label}</p>
                  <p className="font-black text-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}
            <div className="p-4 bg-secondary/30 rounded-2xl border border-border/30 flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-inner">
                <Wifi className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">API Gateway</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {statusDot(apiStatus)}
                  {statusText(apiStatus, 'Operational', 'Offline')}
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/30 rounded-2xl border border-border/30 flex items-center gap-4">
              <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center shadow-inner">
                <Database className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Database Cluster</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {statusDot(dbStatus)}
                  {statusText(dbStatus, 'Connected', 'Disconnected')}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
