'use client'

import { useState } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Plus, Minus, Search, HelpCircle } from "lucide-react"

const FAQs = [
    {
        question: "How do I upload my prescription?",
        answer: "You can upload your prescription by clicking the 'Prescriptions' link in the header. Our website supports JPG, PNG, and PDF formats. Once uploaded, our registered pharmacists will verify it before processing your order."
    },
    {
        question: "What is the typical delivery time?",
        answer: "We offer fast delivery across the city. Most orders are delivered within 4-24 hours. For outstation orders, it may take 2-3 business days depending on your location."
    },
    {
        question: "Are the medicines authentic?",
        answer: "Yes, Sri Shaurya Medicals only sources medicines directly from authorized distributors and verified manufacturers. We maintain strict quality control and proper storage conditions (cold chain for insulin, etc.)."
    },
    {
        question: "Can I return unused medicines?",
        answer: "Medicines can be returned within 7 days of delivery only if the packaging is intact. Refrigerated items and opened strips are not eligible for returns for safety reasons. Please check our Return Policy for more details."
    },
    {
        question: "Do you offer cash on delivery?",
        answer: "Yes, we support multiple payment options including Cash on Delivery (COD), UPI, Credit/Debit cards, and Net Banking for your convenience."
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredFAQs = FAQs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="bg-card border-b border-border py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-6">
                            <HelpCircle className="text-primary w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">Frequently Asked <span className="text-primary italic">Questions</span></h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                            Everything you need to know about ordering medicines at Sri Shaurya. Can't find an answer? Contact our support team.
                        </p>

                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="premium-input w-full pl-12 h-14"
                            />
                        </div>
                    </div>
                </section>

                <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        {filteredFAQs.map((faq, index) => (
                            <div
                                key={index}
                                className={`glass rounded-3xl border border-border/50 overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-xl shadow-primary/5' : ''}`}
                            >
                                <button
                                    onClick={() => setOpenIndex(index === openIndex ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold text-foreground text-lg">{faq.question}</span>
                                    <div className={`shrink-0 ml-4 p-2 rounded-xl transition-colors ${openIndex === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                                        {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>

                                <div className={`px-6 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {filteredFAQs.length === 0 && (
                            <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                                <p className="text-muted-foreground font-medium">No matching questions found.</p>
                                <button onClick={() => setSearchQuery('')} className="text-primary font-bold mt-2">Clear search</button>
                            </div>
                        )}
                    </div>

                    <div className="mt-20 glass p-8 rounded-[2.5rem] border border-border/50 text-center">
                        <h3 className="text-xl font-black text-foreground mb-2">Still have questions?</h3>
                        <p className="text-muted-foreground mb-6">Our dedicated support team is ready to assist you round the clock.</p>
                        <a href="/contact" className="btn-primary-premium inline-flex px-10">Contact Support</a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
