'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShoppingCart, FileText, MapPin, User, LogOut, Edit2, Plus, Loader2 } from 'lucide-react'
import { fetchUserOrders } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const customer = useAuthStore(state => state.customer)
  const logoutCustomer = useAuthStore(state => state.logoutCustomer)
  const [isHydrated, setIsHydrated] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !customer) {
      router.push('/login')
    }

    if (isHydrated && customer) {
      async function loadOrders() {
        try {
          const data = await fetchUserOrders(customer.id)
          setOrders(data)
        } catch (error) {
          console.error("Failed to load orders:", error)
        } finally {
          setIsLoading(false)
        }
      }
      loadOrders()
    }
  }, [customer, isHydrated, router])


  if (!isHydrated || !customer) {
    return null
  }

  const handleLogout = () => {
    logoutCustomer()
    router.push('/')
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


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {customer.name}</h1>
          <p className="text-muted-foreground">Manage your pharmacy account and orders</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/shop">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Shop</p>
                    <p className="text-sm text-muted-foreground">Browse medicines</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/prescriptions">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Prescriptions</p>
                    <p className="text-sm text-muted-foreground">Upload prescription</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/orders">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <ShoppingCart className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">My Orders</p>
                    <p className="text-sm text-muted-foreground">Order history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <User className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Profile</p>
                    <p className="text-sm text-muted-foreground">Settings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold text-foreground">{customer.phone}</p>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/profile">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Addresses Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-3">
                  {customer.addresses.map(addr => (
                    <div key={addr.id} className="text-sm">
                      <p className="font-semibold text-foreground">{addr.street}</p>
                      <p className="text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                      {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No addresses saved</p>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/profile">
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Addresses
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="text-sm border-l-2 border-primary pl-3 text-left">
                      <p className="font-bold text-foreground truncate">ID: {order.id.slice(0, 8)}...</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground italic truncate">
                        {order.order_items?.length || 0} ITEMS
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="font-black text-foreground">₹{order.total_amount}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
