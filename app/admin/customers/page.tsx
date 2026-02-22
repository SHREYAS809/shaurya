'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, Mail, Phone, Calendar, User, Loader2, MapPin, ExternalLink } from 'lucide-react'
import { fetchCustomers } from '@/lib/api'

export default function AdminCustomersPage() {
  const router = useRouter()
  const admin = useAuthStore(state => state.admin)
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !admin) {
      router.push('/login/admin')
    }
  }, [admin, isHydrated, router])

  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true)
        const data = await fetchCustomers()
        setCustomers(data)
      } catch (err: any) {
        console.error('Failed to load customers:', err)
        setError(err.message || 'Failed to fetch client data')
      } finally {
        setIsLoading(false)
      }
    }

    if (isHydrated && admin) {
      loadCustomers()
    }
  }, [admin, isHydrated])

  if (!isHydrated || !admin) {
    return null
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Client <span className="text-gradient">Relation</span></h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Customer CRM Module</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl border border-border/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Live Connection</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 reveal">
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by identity, email, or contact point..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-card/50 border-primary/5 focus:border-primary/30 rounded-2xl shadow-inner transition-all"
            />
          </div>
          <Button className="h-14 px-8 rounded-2xl btn-primary-premium shadow-lg shadow-primary/20 font-bold">
            Export Database
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Syncing Client Records...</p>
          </div>
        ) : error ? (
          <Card className="border-red-500/20 bg-red-500/[0.02] rounded-[2.5rem]">
            <CardContent className="py-20 text-center">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl">Retry Connection</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="text-xs font-bold text-muted-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" />
              Active Entities: {filteredCustomers.length}
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map(customer => (
                <div key={customer.id} className="glass-card rounded-[2.5rem] p-8 group hover:border-primary/30 transition-all duration-500">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                      <User className="w-7 h-7" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Registration ID</span>
                      <p className="text-[11px] font-black text-foreground uppercase tracking-widest truncate max-w-[120px]">
                        {customer.id.split('-')[0]}...
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{customer.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Verified Identity</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30">
                        <div className="p-2 bg-background rounded-lg shadow-inner">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border/30">
                        <div className="p-2 bg-background rounded-lg shadow-inner">
                          <Phone className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{customer.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Affiliated</span>
                        <p className="text-xs font-black text-foreground">{formatDate(customer.created_at)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Last Encounter</span>
                        <p className="text-xs font-black text-foreground">{formatDate(customer.last_sign_in_at)}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full h-12 rounded-2xl border-primary/10 hover:border-primary/30 font-bold group/btn flex items-center justify-center gap-2">
                      Full Transaction History
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-all translate-x-2 group-hover/btn:translate-x-0" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-20 glass-card rounded-[3rem] border-dashed border-primary/20">
                <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold italic">No matching client entities detected</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
