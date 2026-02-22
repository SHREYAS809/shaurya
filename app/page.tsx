'use client'

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { fetchCategories, fetchMedicines } from "@/lib/api";
import { ArrowRight, Truck, Shield, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catData, medData] = await Promise.all([
          fetchCategories(),
          fetchMedicines()
        ]);
        setCategories(catData);
        setMedicines(medData);
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Get featured products (first 8)
  const featuredProducts = medicines.slice(0, 8);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading Sri Shaurya Medicals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ... rest of the component remains similar ... */}
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 sm:py-24 md:py-32">
          {/* Dynamic Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-green-400/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="reveal">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-bounce-slow">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Trusted by 10,000+ Customers
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                  Your Trusted Online <span className="text-gradient">Pharmacy</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
                  Experience the future of healthcare. Get authentic medicines and healthcare essentials delivered with care and speed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/shop"
                    className="btn-primary-premium flex items-center justify-center gap-2 text-lg"
                  >
                    Shop Now
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/prescriptions"
                    className="glass-card px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-all text-lg flex items-center justify-center border-primary/20 text-primary"
                  >
                    Upload Prescription
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="hidden md:flex justify-center items-center reveal" style={{ animationDelay: '0.2s' }}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative w-72 h-72 lg:w-96 lg:h-96 glass-card rounded-3xl flex items-center justify-center text-[120px] lg:text-[180px] group-hover:scale-[1.05] transition-transform duration-500">
                    <span className="animate-float">💊</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="bg-card/50 backdrop-blur-sm border-y border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              <div className="flex items-center gap-5 reveal" style={{ animationDelay: '0.1s' }}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary shadow-inner">
                  <Truck size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">Within 24-48 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-5 reveal" style={{ animationDelay: '0.2s' }}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary shadow-inner">
                  <Shield size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">100% Authentic</h3>
                  <p className="text-sm text-muted-foreground">Verified medicines only</p>
                </div>
              </div>

              <div className="flex items-center gap-5 reveal" style={{ animationDelay: '0.3s' }}>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary shadow-inner">
                  <Clock size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Expert guidance always</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Shop by <span className="text-gradient">Category</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Browse our curated selection of healthcare categories to find exactly what you need.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 reveal">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 sm:py-24 bg-secondary/30 border-y border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 reveal">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Featured <span className="text-gradient">Products</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our most trusted and highly-rated healthcare essentials.
                </p>
              </div>
              <Link
                href="/shop"
                className="group flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-all text-lg"
              >
                Explore All
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-[2.5rem] p-10 sm:p-16 border-primary/10 relative overflow-hidden group reveal">
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-colors duration-700" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                    Have a <span className="text-gradient">Prescription</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                    Don't worry about searching for each item. Just upload your prescription and our pharmacists will handle the rest.
                  </p>
                  <Link
                    href="/prescriptions"
                    className="btn-primary-premium inline-flex items-center justify-center gap-2"
                  >
                    Upload Now
                    <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="hidden md:flex justify-center group-hover:rotate-6 transition-transform duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
                    <span className="text-[120px] relative">📋</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
