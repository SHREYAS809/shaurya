'use client'

import { useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setTimeout(() => {
            setSubmitting(false)
            setSubmitted(true)
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero Header */}
                <section className="relative py-20 bg-card overflow-hidden border-b border-border">
                    <div className="absolute top-0 right-0 w-[30%] h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
                            Get In <span className="text-primary italic">Touch</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                            Have questions about your prescription or healthcare needs? Our expert pharmacists are here to help you 24/7.
                        </p>
                    </div>
                </section>

                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Info Cards */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="glass p-6 rounded-3xl border border-border/50">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                            <Phone className="text-primary w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                                        <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">Available 24/7</p>
                                    </div>
                                    <div className="glass p-6 rounded-3xl border border-border/50">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                            <Mail className="text-primary w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                                        <p className="text-sm text-muted-foreground">care@srishaurya.com</p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2">Avg. Response: 1hr</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass p-8 rounded-3xl border border-border/50 flex gap-6 items-start">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin className="text-primary w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground mb-2">Our Main Unit</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Ground Floor, Medical Elite Plaza,<br />
                                        Near General Hospital, Main Road,<br />
                                        Bangalore, Karnataka - 560001
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass p-8 md:p-10 rounded-[2.5rem] border border-border/50 shadow-2xl relative">
                            {submitted ? (
                                <div className="text-center py-12 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-foreground mb-2">Message Sent!</h2>
                                        <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you shortly.</p>
                                    </div>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="btn-primary-premium w-full max-w-[200px]"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                                <input required type="text" className="premium-input w-full" placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                                                <input required type="email" className="premium-input w-full" placeholder="john@example.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                                            <input required type="text" className="premium-input w-full" placeholder="Prescription Inquiry" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                                            <textarea required rows={4} className="premium-input w-full resize-none" placeholder="How can we help you today?" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary-premium w-full py-4 flex items-center justify-center gap-3 transition-all duration-300"
                                    >
                                        {submitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
