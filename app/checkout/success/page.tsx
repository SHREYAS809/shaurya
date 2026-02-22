'use client'

import React from 'react'
import Link from 'next/link'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle2, Package, Calendar, ArrowRight, Home, Check } from "lucide-react"

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 flex items-center justify-center py-20">
                <div className="max-w-2xl w-full px-4 text-center">
                    <div className="relative inline-block mb-10">
                        <div className="absolute -inset-8 bg-emerald-500/10 rounded-full blur-[40px] animate-pulse" />
                        <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                            <CheckCircle2 className="text-white w-12 h-12" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
                        Order <span className="text-emerald-500">Confirmed!</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium mb-12">
                        We've received your order and our pharmacist is preparing your package. Your medicines are on their way!
                    </p>

                    <div className="glass p-8 rounded-[3rem] border border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-12">
                        <div className="flex gap-5 items-start">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Package className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Fast Delivery</h3>
                                <p className="text-sm text-muted-foreground">Estimated arrival within 4-24 hours across Bangalore.</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Calendar className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Real-time Updates</h3>
                                <p className="text-sm text-muted-foreground">You will receive SMS updates at every stage of delivery.</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Check className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">WhatsApp Confirmation</h3>
                                <p className="text-sm text-muted-foreground">Order confirmed. Updates will be sent on WhatsApp.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard" className="btn-primary-premium px-10 py-4 flex items-center justify-center gap-2">
                            <span>Track Order</span>
                            <ArrowRight size={18} />
                        </Link>
                        <Link href="/" className="px-10 py-4 rounded-2xl font-bold bg-secondary text-foreground hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border/50">
                            <Home size={18} />
                            <span>Return Home</span>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
