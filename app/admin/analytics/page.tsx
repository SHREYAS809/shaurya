'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, TrendingUp, Calendar, Users, ShoppingCart } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const admin = useAuthStore(state => state.admin)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !admin) {
      router.push('/login/admin')
    }
  }, [admin, isHydrated, router])

  if (!isHydrated || !admin) {
    return null
  }

  const analyticsData = [
    {
      title: 'Revenue This Month',
      value: '₹45,230',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Customers',
      value: '1,245',
      change: '+8%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Orders Completed',
      value: '234',
      change: '+5%',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Average Order Value',
      value: '₹385',
      change: '+3%',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const topProducts = [
    { name: 'Paracetamol 500mg', sales: 145, revenue: '₹21,750' },
    { name: 'Cough Syrup', sales: 89, revenue: '₹24,920' },
    { name: 'Vitamin C 500mg', sales: 76, revenue: '₹9,120' },
    { name: 'Aspirin', sales: 64, revenue: '₹9,600' },
    { name: 'Iron Supplement', sales: 52, revenue: '₹9,360' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analyticsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing medicines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                    <p className="font-semibold text-foreground">{product.revenue}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Revenue by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'Pain Relief', percentage: 35, amount: '₹15,820' },
                  { category: 'Cough & Cold', percentage: 28, amount: '₹12,664' },
                  { category: 'Supplements', percentage: 20, amount: '₹9,046' },
                  { category: 'Digestive', percentage: 12, amount: '₹5,428' },
                  { category: 'Other', percentage: 5, amount: '₹2,262' },
                ].map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-semibold text-foreground">{cat.category}</p>
                      <p className="text-sm text-muted-foreground">{cat.amount}</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{cat.percentage}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
