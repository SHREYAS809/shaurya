'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Shield, Lock, Loader2 } from 'lucide-react'

export default function AdminPage() {
    const router = useRouter()
    const admin = useAuthStore(state => state.admin)
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        if (isHydrated) {
            if (admin) {
                router.replace('/admin/dashboard')
            } else {
                router.replace('/login/admin')
            }
        }
    }, [admin, isHydrated, router])

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative glass p-8 rounded-full">
                    <Shield className="w-12 h-12 text-primary animate-float" />
                </div>
            </div>
            <div className="mt-8 flex items-center gap-3 text-muted-foreground font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing Secure Portal...
            </div>
        </div>
    )
}
