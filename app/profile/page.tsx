'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit2, Plus, Trash2, Save } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const customer = useAuthStore(state => state.customer)
  const updateCustomerProfile = useAuthStore(state => state.updateCustomerProfile)
  const addAddress = useAuthStore(state => state.addAddress)
  const deleteAddress = useAuthStore(state => state.deleteAddress)
  const [isHydrated, setIsHydrated] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [addingAddress, setAddingAddress] = useState(false)
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' })
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && !customer) {
      router.push('/login')
    } else if (customer) {
      setProfileData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
      })
    }
  }, [customer, isHydrated, router])

  if (!isHydrated || !customer) {
    return null
  }

  const handleUpdateProfile = () => {
    updateCustomerProfile(profileData)
    setEditingProfile(false)
  }

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.pincode) {
      addAddress({
        id: Date.now().toString(),
        ...newAddress,
        isDefault: !customer.addresses || customer.addresses.length === 0,
      })
      setNewAddress({ street: '', city: '', state: '', pincode: '' })
      setAddingAddress(false)
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
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </div>
                {!editingProfile && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProfile(true)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!editingProfile}
                    className="bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={profileData.email}
                    disabled
                    className="bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editingProfile}
                    className="bg-card"
                  />
                </div>

                {editingProfile && (
                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                      onClick={handleUpdateProfile}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-xl font-bold text-foreground">Dec 2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-xl font-bold text-foreground">3</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-xl font-bold text-foreground">₹1,270</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Saved Addresses</CardTitle>
                <CardDescription>Your delivery addresses</CardDescription>
              </div>
              {!addingAddress && (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={() => setAddingAddress(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </Button>
              )}
            </CardHeader>

            <CardContent>
              {addingAddress && (
                <div className="mb-6 p-4 border-2 border-primary/20 rounded-lg space-y-4">
                  <h4 className="font-semibold text-foreground">Add New Address</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Street Address</Label>
                      <Input
                        placeholder="123 Main Street"
                        value={newAddress.street}
                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="bg-card"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>City</Label>
                        <Input
                          placeholder="Bangalore"
                          value={newAddress.city}
                          onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="bg-card"
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Input
                          placeholder="Karnataka"
                          value={newAddress.state}
                          onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="bg-card"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input
                        placeholder="560001"
                        value={newAddress.pincode}
                        onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="bg-card"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleAddAddress}
                    >
                      Save Address
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => setAddingAddress(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {customer.addresses && customer.addresses.length > 0 ? (
                  customer.addresses.map(address => (
                    <div key={address.id} className="p-4 border border-border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{address.street}</p>
                          <p className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.pincode}</p>
                          {address.isDefault && (
                            <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2">
                              Default Address
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteAddress(address.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No addresses saved yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
