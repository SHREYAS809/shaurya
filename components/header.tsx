"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useRouter } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const customer = useAuthStore(state => state.customer);
  const logoutCustomer = useAuthStore(state => state.logoutCustomer);
  const cartCount = useCartStore(state => state.getItemCount());
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = () => {
    logoutCustomer();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">💊</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-foreground">Sri Shaurya</h1>
              <p className="text-xs text-muted-foreground">Medicals & Healthcare</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-foreground hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/prescriptions" className="text-foreground hover:text-primary transition-colors">
              Prescriptions
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Search size={20} className="text-foreground" />
            </button>
            <Link href="/cart" className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
              <ShoppingCart size={20} className="text-foreground" />
              {isHydrated && cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
            {isHydrated ? (
              customer ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Dashboard">
                    <User size={20} className="text-foreground" />
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg transition-colors" title="Logout">
                    <LogOut size={20} className="text-foreground" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <User size={20} className="text-foreground" />
                </Link>
              )
            ) : (
              <div className="w-10 h-10" /> // Placeholder while hydrating
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-foreground" />
              ) : (
                <Menu size={20} className="text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border">
            <Link href="/" className="block py-2 px-0 text-foreground hover:text-primary">
              Home
            </Link>
            <Link href="/shop" className="block py-2 px-0 text-foreground hover:text-primary">
              Shop
            </Link>
            <Link href="/prescriptions" className="block py-2 px-0 text-foreground hover:text-primary">
              Prescriptions
            </Link>
            <Link href="/about" className="block py-2 px-0 text-foreground hover:text-primary">
              About
            </Link>
            {isHydrated && (
              customer ? (
                <>
                  <Link href="/dashboard" className="block py-2 px-0 text-foreground hover:text-primary">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left py-2 px-0 text-foreground hover:text-primary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-2 px-0 text-foreground hover:text-primary">
                    Login
                  </Link>
                  <Link href="/signup" className="block py-2 px-0 text-foreground hover:text-primary">
                    Sign Up
                  </Link>
                </>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
