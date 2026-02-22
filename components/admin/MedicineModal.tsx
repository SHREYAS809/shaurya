'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { fetchCategories } from '@/lib/api'

interface MedicineModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => Promise<void>
    medicine?: any
}

export function MedicineModal({ isOpen, onClose, onSave, medicine }: MedicineModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
    })

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await fetchCategories()
                setCategories(data)
            } catch (err) {
                console.error('Failed to load categories:', err)
            }
        }
        if (isOpen) {
            loadCategories()
        }
    }, [isOpen])

    useEffect(() => {
        if (medicine) {
            setFormData({
                name: medicine.name || '',
                category_id: medicine.category_id?.toString() || '',
                price: medicine.price?.toString() || '',
                stock: medicine.stock?.toString() || '',
                description: medicine.description || '',
            })
        } else {
            setFormData({
                name: '',
                category_id: '',
                price: '',
                stock: '',
                description: '',
            })
        }
    }, [medicine, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await onSave({
                ...formData,
                category_id: parseInt(formData.category_id),
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            })
            onClose()
        } catch (err) {
            console.error('Failed to save medicine:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] glass-card border-primary/10">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground">
                        {medicine ? 'Edit' : 'Register'} <span className="text-gradient">Medicine</span>
                    </DialogTitle>
                    <DialogDescription>
                        Enter the details for the pharmaceutical entry below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-secondary/50 border-primary/5 focus:border-primary/30 rounded-xl"
                                placeholder="e.g. Paracetamol 500mg"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category Selection</Label>
                            <Select
                                value={formData.category_id}
                                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                required
                            >
                                <SelectTrigger className="bg-secondary/50 border-primary/5 focus:border-primary/30 rounded-xl">
                                    <SelectValue placeholder="Select medical group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                required
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="bg-secondary/50 border-primary/5 focus:border-primary/30 rounded-xl tabular-nums"
                                placeholder="0.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="bg-secondary/50 border-primary/5 focus:border-primary/30 rounded-xl tabular-nums"
                                placeholder="0"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-secondary/50 border-primary/5 focus:border-primary/30 rounded-xl min-h-[100px]"
                                placeholder="Technical specifications and usage instructions..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="btn-primary-premium px-8 rounded-xl font-bold">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {medicine ? 'Update Database' : 'Finalize Entry'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
