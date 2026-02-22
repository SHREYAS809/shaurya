'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, Users, TrendingUp, LogOut, Settings, BarChart3, Shield, Loader2 } from 'lucide-react'
import { fetchDashboardStats, fetchRecentActivity } from '@/lib/api'

export default function AdminDashboardPage() {
  const router = useRouter()
  const admin = useAuthStore(state => state.admin)
  const logoutAdmin = useAuthStore(state => state.logoutAdmin)
  const [isHydrated, setIsHydrated] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !admin) {
      router.push('/login/admin')
    }
  }, [admin, isHydrated, router])

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true)
        const [statsData, activityData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentActivity()
        ])
        setStats(statsData)
        setRecentOrders(activityData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (isHydrated && admin) {
      loadDashboard()
    }
  }, [admin, isHydrated])

  if (!isHydrated || !admin) return null

  const handleLogout = () => {
    logoutAdmin()
    router.push('/')
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue ?? '—',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      title: 'Orders Today',
      value: stats?.ordersToday ?? '—',
      icon: ShoppingCart,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Active Products',
      value: stats?.activeProducts ?? '—',
      icon: Package,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Client Entities',
      value: stats?.totalCustomers ?? '—',
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-green-400/5 rounded-full blur-[100px] -z-10" />

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground tracking-tight">Admin <span className="text-gradient">Console</span></h1>
            </div>
            <p className="text-xs text-muted-foreground font-medium">System Operator: {admin.name}</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">Secure Exit</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 reveal">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="glass-card rounded-2xl p-6 border-primary/5 group hover:border-primary/20 transition-all duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{stat.title}</p>
                    {isLoading ? (
                      <div className="h-8 w-20 bg-secondary animate-pulse rounded-lg mt-1" />
                    ) : (
                      <p className="text-3xl font-black text-foreground tabular-nums tracking-tight">{stat.value}</p>
                    )}
                  </div>
                  <div className={`${stat.bg} p-4 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`} />
                  <span className={`text-[10px] font-bold uppercase ${isLoading ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {isLoading ? 'Syncing...' : 'Live Data'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-[2.5rem] overflow-hidden border-primary/5">
              <div className="p-8 border-b border-border/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Recent <span className="text-gradient">Activity</span></h2>
                  <p className="text-sm text-muted-foreground">Latest pharmacy transactions</p>
                </div>
                <Link href="/admin/orders">
                  <Button variant="outline" className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary/5">
                    Full Report
                  </Button>
                </Link>
              </div>
              <div className="p-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading Activity...</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No orders recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground/60 border-b border-border/30">
                          <th className="py-4 px-4 font-bold uppercase tracking-tighter text-[10px]">Reference</th>
                          <th className="py-4 px-4 font-bold uppercase tracking-tighter text-[10px]">Customer</th>
                          <th className="py-4 px-4 font-bold uppercase tracking-tighter text-[10px]">Net Value</th>
                          <th className="py-4 px-4 font-bold uppercase tracking-tighter text-[10px]">Status</th>
                          <th className="py-4 px-4 font-bold uppercase tracking-tighter text-[10px]">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {recentOrders.map((order: any) => (
                          <tr key={order.id} className="group hover:bg-primary/5 transition-colors">
                            <td className="py-5 px-4 text-foreground font-black tracking-widest text-[11px]">{order.id}</td>
                            <td className="py-5 px-4 text-muted-foreground font-medium">{order.customer}</td>
                            <td className="py-5 px-4 text-foreground font-black">{order.amount}</td>
                            <td className="py-5 px-4">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                  order.status === 'Pending' || order.status === 'New' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                    'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-5 px-4 text-xs font-bold text-muted-foreground/60">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Hub */}
          <div className="space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 border-primary/5">
              <h3 className="text-xl font-bold text-foreground mb-6">Management <span className="text-gradient">Hub</span></h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Inventory Control', href: '/admin/medicines', icon: Package },
                  { label: 'Order Pipeline', href: '/admin/orders', icon: ShoppingCart },
                  { label: 'Client Relation', href: '/admin/customers', icon: Users },
                  { label: 'Market Metrics', href: '/admin/analytics', icon: BarChart3 },
                  { label: 'Core Configuration', href: '/admin/settings', icon: Settings },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button variant="ghost" className="w-full justify-start py-7 rounded-2xl hover:bg-primary/10 group transition-all">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-muted-foreground group-hover:text-foreground">{item.label}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`} />
                <h3 className="font-bold text-foreground">Operational Status</h3>
              </div>
              <div className="space-y-4 font-mono text-xs">
                {[
                  { label: 'API GATEWAY', status: 'STABLE', color: 'text-emerald-500' },
                  { label: 'DB CLUSTER', status: isLoading ? 'SYNCING' : 'OPTIMAL', color: isLoading ? 'text-amber-500' : 'text-emerald-500' },
                  { label: 'PAYMENT_SEC', status: 'ENCRYPTED', color: 'text-indigo-500' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border/30">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className={`${s.color} font-black tracking-tighter`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
