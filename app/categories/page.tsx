'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"
import { fetchCategories } from "@/lib/api"
import { Loader2, LayoutGrid } from "lucide-react"

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchCategories()
                setCategories(data)
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                <section className="bg-card border-b border-border py-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[40%] h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-6">
                            <LayoutGrid className="text-primary w-8 h-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Health <span className="text-primary italic">Categories</span></h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore our wide range of medicines and healthcare products organized by category for your convenience.
                        </p>
                    </div>
                </section>

                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                            <p className="text-muted-foreground font-medium">Fetching healthcare categories...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {categories.map((category) => (
                                <CategoryCard key={category.id} {...category} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}
