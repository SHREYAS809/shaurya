'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react'
import { fetchMedicines, createMedicine, updateMedicine, deleteMedicine } from '@/lib/api'
import { MedicineModal } from '@/components/admin/MedicineModal'

export default function AdminMedicinesPage() {
  const router = useRouter()
  const admin = useAuthStore(state => state.admin)
  const [isHydrated, setIsHydrated] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [medicines, setMedicines] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  async function loadMedicines() {
    setIsLoading(true)
    try {
      const data = await fetchMedicines()
      setMedicines(data)
    } catch (error) {
      console.error("Failed to load admin medicines:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isHydrated && admin) {
      loadMedicines()
    }
  }, [isHydrated, admin])

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (selectedMedicine) {
        await updateMedicine(selectedMedicine.id, data)
      } else {
        await createMedicine(data)
      }
      await loadMedicines()
    } catch (err) {
      console.error('Failed to save medicine:', err)
      throw err
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      try {
        await deleteMedicine(id)
        await loadMedicines()
      } catch (err) {
        console.error('Failed to delete medicine:', err)
      }
    }
  }

  useEffect(() => {
    if (isHydrated && !admin) {
      router.push('/login/admin')
    }
  }, [admin, isHydrated, router])

  if (!isHydrated || !admin) {
    return null
  }

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.categories?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-green-400/5 rounded-full blur-[100px] -z-10" />

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Medicine <span className="text-gradient">Control</span></h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inventory Management System</p>
            </div>
          </div>
          <Button
            onClick={() => { setSelectedMedicine(null); setIsModalOpen(true); }}
            className="btn-primary-premium py-2 px-6 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="font-bold">Add Entry</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10 reveal">
        {/* Search */}
        <div className="glass-card rounded-2xl p-6 border-primary/5 mb-10 group hover:border-primary/20 transition-all duration-500">
          <div className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-4 border border-border/50 focus-within:border-primary/30 transition-all">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Query Inventory (Name, Category, ID)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent focus:ring-0 text-foreground font-medium p-0"
            />
          </div>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map(medicine => (
            <div key={medicine.id} className="glass-card rounded-[2rem] p-6 border-primary/5 hover:border-primary/20 transition-all duration-500 group flex flex-col h-full">
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{medicine.categories?.name || 'Uncategorized'}</p>
                <h3 className="font-bold text-foreground text-xl leading-snug line-clamp-2 h-14">{medicine.name}</h3>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex justify-between items-center p-3 bg-primary/[0.03] rounded-xl border border-primary/5">
                  <span className="text-xs font-bold text-muted-foreground">UNIT PRICE</span>
                  <span className="font-black text-foreground tabular-nums">₹{medicine.price}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl border border-border/30">
                  <span className="text-xs font-bold text-muted-foreground">STOCK STATUS</span>
                  <span className={`font-black tabular-nums tracking-tighter ${medicine.stock > 20 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {medicine.stock} UNITS
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground/70 font-medium mb-6 line-clamp-2 leading-relaxed h-10 italic">
                "{medicine.description}"
              </p>

              <div className="flex gap-3 mt-auto">
                <Button
                  onClick={() => { setSelectedMedicine(medicine); setIsModalOpen(true); }}
                  variant="ghost"
                  className="flex-1 py-6 rounded-2xl bg-secondary/50 font-bold hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(medicine.id)}
                  variant="ghost"
                  className="flex-1 py-6 rounded-2xl bg-red-500/5 text-red-500/70 font-bold hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Drop
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="glass-card rounded-[2.5rem] py-20 text-center border-dashed border-2 border-border/50">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-xl font-bold text-foreground mb-2">Zero Matches Found</p>
            <p className="text-sm text-muted-foreground mb-8">Refine your search parameters or add a new entry.</p>
            <Button
              onClick={() => { setSelectedMedicine(null); setIsModalOpen(true); }}
              className="btn-primary-premium px-10 py-6 rounded-2xl font-bold"
            >
              Register New Medicine
            </Button>
          </div>
        )}
      </main>

      <MedicineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        medicine={selectedMedicine}
      />
    </div>
  )
}
