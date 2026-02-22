'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, MapPin, Calendar, DollarSign, Package } from 'lucide-react'
import Link from 'next/link'

interface Order {
  id: string
  date: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered'
  deliveryAddress: string
  estimatedDelivery: string
}

export default function OrdersPage() {
  const router = useRouter()
  const customer = useAuthStore(state => state.customer)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !customer) {
      router.push('/login')
    }
  }, [customer, isHydrated, router])

  if (!isHydrated || !customer) {
    return null
  }

  const orders: Order[] = [
    {
      id: 'ORD-001',
      date: 'Dec 15, 2024',
      items: [
        { name: 'Paracetamol 500mg', quantity: 2, price: 150 },
        { name: 'Aspirin', quantity: 1, price: 150 },
      ],
      total: 450,
      status: 'Delivered',
      deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
      estimatedDelivery: 'Delivered on Dec 16',
    },
    {
      id: 'ORD-002',
      date: 'Dec 10, 2024',
      items: [
        { name: 'Cough Syrup', quantity: 1, price: 280 },
      ],
      total: 280,
      status: 'Delivered',
      deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
      estimatedDelivery: 'Delivered on Dec 11',
    },
    {
      id: 'ORD-003',
      date: 'Dec 20, 2024',
      items: [
        { name: 'Vitamin C 500mg', quantity: 3, price: 120 },
        { name: 'Iron Supplement', quantity: 1, price: 180 },
      ],
      total: 540,
      status: 'Processing',
      deliveryAddress: '123 Main Street, Bangalore, Karnataka 560001',
      estimatedDelivery: 'Expected on Dec 22',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700'
      case 'Shipped':
        return 'bg-blue-100 text-blue-700'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Orders</h1>
            <p className="text-muted-foreground">Track your medicine orders</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-card/50 pb-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4" />
                      {order.date}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">₹{order.total}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} mt-2`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <div>
                            <p className="text-foreground font-medium">{item.name}</p>
                            <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-foreground">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Delivery
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Address</p>
                        <p className="text-foreground">{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Estimated Delivery</p>
                        <p className="text-foreground">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-4">Order Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                        <div className="w-0.5 h-8 bg-primary mt-2"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Order Placed</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${order.status !== 'Pending' ? 'bg-primary' : 'bg-muted'}`}></div>
                        <div className={`w-0.5 h-8 mt-2 ${order.status === 'Delivered' ? 'bg-primary' : 'bg-muted'}`}></div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Processing</p>
                        <p className="text-sm text-muted-foreground">Confirmed by pharmacy</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${order.status === 'Delivered' ? 'bg-primary' : 'bg-muted'}`}></div>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.status === 'Delivered' ? 'Delivered' : 'Pending Delivery'}</p>
                        <p className="text-sm text-muted-foreground">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Track Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping for medicines today</p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
