"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCartStore } from "@/lib/stores/cart-store";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items: cartProducts, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const subtotal = getTotalPrice();
  const taxAmount = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + taxAmount + shippingFee;

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
          <ShoppingBag size={64} className="text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Start shopping to add items to your cart
          </p>
          <Link
            href="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">
              Shopping Cart
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                {cartProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="flex gap-4 p-6 border-b border-border last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1">
                        {product.name}
                      </h3>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between gap-4">
                      <button
                        onClick={() => removeItem(product.productId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="flex items-center border border-border rounded-lg bg-secondary">
                        <button
                          onClick={() =>
                            updateQuantity(product.productId, product.quantity - 1)
                          }
                          className="px-3 py-1 text-foreground hover:bg-muted"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 text-foreground text-sm font-semibold">
                          {product.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product.productId, product.quantity + 1)
                          }
                          className="px-3 py-1 text-foreground hover:bg-muted"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <span className="font-bold text-foreground text-right">
                        ₹{(product.price * product.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mt-6"
              >
                <ArrowLeft size={18} />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <h2 className="font-bold text-foreground text-lg mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span className="text-foreground font-semibold">
                      ₹{taxAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span className="text-foreground font-semibold">
                        ₹{shippingFee}
                      </span>
                    )}
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders above ₹500
                    </p>
                  )}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-center hover:bg-primary/90 transition-colors mb-3"
                >
                  Proceed to Checkout
                </Link>

                <button className="w-full border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
