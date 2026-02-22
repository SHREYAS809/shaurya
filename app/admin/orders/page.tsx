'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Search, Filter, MoreHorizontal, Loader2 } from 'lucide-react'
import { fetchAllOrders, updateOrderStatus } from '@/lib/api'

export default function AdminOrdersPage() {
  const router = useRouter()
  const admin = useAuthStore(state => state.admin)
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchAllOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to load admin orders:", error)
      } finally {
        setIsLoading(false)
      }
    }
    if (isHydrated && admin) {
      loadOrders()
    }
  }, [isHydrated, admin])

  useEffect(() => {
    if (isHydrated && !admin) {
      router.push('/login/admin')
    }
  }, [admin, isHydrated, router])

  if (!isHydrated || !admin) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("Status update failed")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm'
      case 'Dispatched':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 shadow-sm'
      case 'Ready':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm'
      case 'Accepted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-sm'
      case 'New':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20 shadow-sm'
      default:
        return 'bg-secondary/50 text-muted-foreground border-border/50'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-green-400/5 rounded-full blur-[100px] -z-10" />

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Order <span className="text-gradient">Pipeline</span></h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Transactional Logistics Dashboard</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 reveal">
        {/* Controls */}
        <div className="glass-card rounded-[2rem] p-8 border-primary/5 mb-10 group hover:border-primary/20 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-4 border border-border/50 focus-within:border-primary/30 transition-all">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search Reference, Name, or Email Protocol..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent focus:ring-0 text-foreground font-medium p-0"
              />
            </div>
            <div className="lg:col-span-3 flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-4 border border-border/50 focus-within:border-primary/30 transition-all">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-transparent border-0 text-sm font-bold text-foreground focus:ring-0 w-full cursor-pointer"
              >
                <option value="all">Display All Protocols</option>
                <option value="New">New Order</option>
                <option value="Accepted">Accepted Flow</option>
                <option value="Ready">Ready for Pickup</option>
                <option value="Dispatched">Dispatch Active</option>
                <option value="Completed">Success State</option>
              </select>
            </div>
            <div className="lg:col-span-2 text-right">
              <p className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase">
                Active Nodes: <span className="text-foreground">{filteredOrders.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden border-primary/5 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-primary/[0.02]">
                  <th className="py-6 px-6 text-left font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">ID</th>
                  <th className="py-6 px-6 text-left font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">Customer Entity</th>
                  <th className="py-6 px-6 text-left font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">Units</th>
                  <th className="py-6 px-6 text-left font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">Gross Value</th>
                  <th className="py-6 px-6 text-left font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">Status</th>
                  <th className="py-6 px-6 text-left font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">Timeline</th>
                  <th className="py-6 px-6 text-right font-black uppercase tracking-tighter text-[10px] text-muted-foreground/60">Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="group hover:bg-primary/5 transition-colors">
                    <td className="py-6 px-6">
                      <p className="font-black text-foreground tracking-widest text-[11px]">{order.id.slice(0, 8)}...</p>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">User ID: {order.user_id.slice(0, 8)}...</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Status Node Activated</span>
                      </div>
                    </td>
                    <td className="py-6 px-6 font-medium text-xs">{order.order_items?.length || 0} ITEMS</td>
                    <td className="py-6 px-6 font-black text-foreground">₹{order.total_amount}</td>
                    <td className="py-6 px-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-xs font-bold text-muted-foreground/60">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-6 px-6 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-secondary/50 border border-border/50 rounded-lg text-[10px] font-black uppercase py-1 px-2 focus:ring-0 cursor-pointer hover:border-primary/30 transition-all"
                      >
                        <option value="New">New</option>
                        <option value="Accepted">Accept</option>
                        <option value="Ready">Ready</option>
                        <option value="Dispatched">Dispatch</option>
                        <option value="Completed">Complete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-xl font-bold text-foreground mb-2">Protocol Empty</p>
              <p className="text-sm text-muted-foreground">No records match the current filter selection.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
