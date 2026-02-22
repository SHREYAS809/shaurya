'use client'
import { useEffect } from 'react'

// One-time migration: clears old cart localStorage keys from previous versions
const OLD_CART_KEYS = ['shaurya-cart-storage']

export function CartMigration() {
    useEffect(() => {
        OLD_CART_KEYS.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key)
                console.log(`[CartMigration] Cleared stale cart key: ${key}`)
            }
        })
    }, [])
    return null
}
