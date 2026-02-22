import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  addresses?: Address[]
  isAdmin?: boolean
}

export interface Address {
  id: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface AuthState {
  customer: User | null
  admin: User | null
  isCustomerLoggedIn: boolean
  isAdminLoggedIn: boolean
  tempUserData: { name: string; email: string; phone: string } | null

  // Customer actions
  loginCustomer: (email: string, password: string) => Promise<void>
  signupCustomer: (name: string, email: string, phone: string, password: string) => Promise<void>
  sendOtp: (email: string, name: string, phone: string) => Promise<void>
  verifyOtp: (email: string, token: string) => Promise<string> // Returns userId
  completeSignup: (userId: string, password: string) => Promise<void>
  logoutCustomer: () => Promise<void>
  updateCustomerProfile: (user: Partial<User>) => void
  addAddress: (address: Address) => void
  updateAddress: (addressId: string, address: Address) => void
  deleteAddress: (addressId: string) => void

  // Admin actions
  loginAdmin: (email: string, password: string) => Promise<void>
  signupAdmin: (name: string, email: string, phone: string, password: string) => Promise<void>
  logoutAdmin: () => Promise<void>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      admin: null,
      isCustomerLoggedIn: false,
      isAdminLoggedIn: false,
      tempUserData: null,

      // Customer actions
      loginCustomer: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.detail || 'Login failed')
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name || 'Customer',
          phone: data.user.user_metadata.phone,
        }

        set({ customer: user, isCustomerLoggedIn: true })
      },

      signupCustomer: async (name, email, phone, password) => {
        // Obsolete but kept for compatibility, prefer OTP flow
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Signup failed')
        }

        const data = await response.json()
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name,
          phone: data.user.user_metadata.phone,
        }

        set({ customer: user, isCustomerLoggedIn: true })
      },

      sendOtp: async (email, name, phone) => {
        const response = await fetch(`${API_URL}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Failed to send OTP')
        }

        set({ tempUserData: { name, email, phone } })
      },

      verifyOtp: async (email, token) => {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, token })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Invalid OTP')
        }

        const data = await response.json()
        return data.user.id
      },

      completeSignup: async (userId, password) => {
        const temp = get().tempUserData
        if (!temp) throw new Error("Signup session expired")

        const response = await fetch(`${API_URL}/auth/update-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            password,
            name: temp.name,
            phone: temp.phone
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Failed to complete registration')
        }

        const data = await response.json()
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name,
          phone: data.user.user_metadata.phone,
        }

        set({ customer: user, isCustomerLoggedIn: true, tempUserData: null })
      },

      logoutCustomer: async () => {
        try {
          await fetch(`${API_URL}/auth/logout`, { method: 'POST' })
        } catch (err) {
          console.error('Logout failed:', err)
        } finally {
          set({ customer: null, isCustomerLoggedIn: false })
        }
      },

      updateCustomerProfile: (profile: Partial<User>) => {
        const current = get().customer
        if (current) {
          set({ customer: { ...current, ...profile } })
        }
      },

      addAddress: (address: Address) => {
        const current = get().customer
        if (current) {
          set({
            customer: {
              ...current,
              addresses: [...(current.addresses || []), address],
            }
          })
        }
      },

      updateAddress: (addressId: string, address: Address) => {
        const current = get().customer
        if (current && current.addresses) {
          set({
            customer: {
              ...current,
              addresses: current.addresses.map(a => a.id === addressId ? address : a),
            }
          })
        }
      },

      deleteAddress: (addressId: string) => {
        const current = get().customer
        if (current && current.addresses) {
          set({
            customer: {
              ...current,
              addresses: current.addresses.filter(a => a.id !== addressId),
            }
          })
        }
      },

      // Admin actions
      loginAdmin: async (email, password) => {
        // NOTE: For now, admin login uses the same endpoint as customer login.
        // Role-based access control (RBAC) is handled via Supabase user metadata.
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.detail || 'Admin login failed')
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name || 'Admin',
          isAdmin: true,
        }

        set({ admin: user, isAdminLoggedIn: true })
      },

      signupAdmin: async (name, email, phone, password) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.detail || 'Admin signup failed')
        }

        const data = await response.json()
        const user: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name,
          isAdmin: true,
        }

        set({ admin: user, isAdminLoggedIn: true })
      },

      logoutAdmin: async () => {
        try {
          await fetch(`${API_URL}/auth/logout`, { method: 'POST' })
        } catch (err) {
          console.error('Admin logout failed:', err)
        } finally {
          set({ admin: null, isAdminLoggedIn: false })
        }
      },
    }),
    {
      name: 'shaurya-auth-storage',
    }
  )
)
