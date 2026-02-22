"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { createOrder, fetchMedicines } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartProducts, getTotalPrice, clearCart, removeItem } = useCartStore();
  const customer = useAuthStore(state => state.customer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [step, setStep] = useState<"details" | "payment">("details");
  const [formData, setFormData] = useState({
    firstName: customer?.name?.split(' ')[0] || "",
    lastName: customer?.name?.split(' ')[1] || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "credit-card",
  });

  // Sanitize cart on mount: purge stale medicine IDs and clear legacy localStorage key
  useEffect(() => {
    setMounted(true);
    try { localStorage.removeItem('shaurya-cart-storage'); } catch { }

    async function sanitizeCart() {
      try {
        const medicines = await fetchMedicines();
        const validIds = new Set(medicines.map((m: any) => Number(m.id)));
        cartProducts.forEach(item => {
          if (!validIds.has(Number(item.productId))) {
            console.warn('[Cart] Removing stale item id:', item.productId);
            removeItem(item.productId);
          }
        });
      } catch (e) {
        console.warn('[Cart] Sanitize failed:', e);
      }
    }
    sanitizeCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotal = mounted ? getTotalPrice() : 0;
  const taxAmount = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + taxAmount + shippingFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      alert("Please login to place an order");
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await createOrder({
        user_id: customer.id,
        total_amount: total,
        items: cartProducts.map(item => ({
          medicine_id: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        phone: formData.phone,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim()
      });
      clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      console.error(err);
      const msg: string = err.message || '';
      // Stale cart: FK violation or explicit "no longer exist" message
      const isStaleCart = msg.includes('23503') || msg.includes('foreign key') || msg.includes('no longer exist') || msg.includes('cart');
      if (isStaleCart) {
        clearCart();
        // Also clear the old localStorage key just in case
        try { localStorage.removeItem('shaurya-cart-storage'); } catch { }
        alert("Some items in your cart are no longer available. Your cart has been cleared — please add items from the shop again.");
        router.push('/');
      } else {
        alert(`Order failed: ${msg || 'Please try again.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Steps */}
          <div className="flex gap-4 mb-8 max-w-2xl mx-auto">
            <div
              className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${step === "details"
                ? "bg-primary text-primary-foreground"
                : step === "payment"
                  ? "bg-green-100 text-green-700"
                  : "bg-secondary text-muted-foreground"
                }`}
            >
              1. Delivery
            </div>
            <div
              className={`flex-1 py-3 px-4 rounded-lg text-center font-semibold ${step === "payment"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
                }`}
            >
              2. Payment
            </div>
            <div
              className="flex-1 py-3 px-4 rounded-lg text-center font-semibold bg-secondary text-muted-foreground"
            >
              3. Confirm
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {step === "details" && (
                <form
                  onSubmit={handleSubmitDetails}
                  className="bg-card rounded-lg border border-border p-8"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Delivery Address
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="col-span-2 sm:col-span-1 px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="col-span-2 sm:col-span-1 px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="col-span-2 sm:col-span-1 px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="col-span-2 sm:col-span-1">
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (WhatsApp enabled)"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        ✔ Order updates will be sent to your WhatsApp number.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
                    <p className="text-xs text-primary font-medium flex items-center gap-2">
                      <Check size={14} />
                      Pharmacy may contact you regarding your order via WhatsApp.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] text-muted-foreground italic">
                      "Your phone number is used only for order updates and will not be shared."
                    </p>
                  </div>

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                  />

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {step === "payment" && (
                <form
                  onSubmit={handleSubmitPayment}
                  className="bg-card rounded-lg border border-border p-8"
                >
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3 mb-8">
                    {[
                      { id: "credit-card", label: "Credit/Debit Card" },
                      { id: "upi", label: "UPI" },
                      { id: "netbanking", label: "Net Banking" },
                      { id: "wallet", label: "Digital Wallet" },
                      { id: "cod", label: "Cash on Delivery" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="w-4 h-4"
                        />
                        <span className="font-semibold text-foreground">
                          {method.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        "Confirm Order"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <h2 className="font-bold text-foreground text-lg mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cartProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {product.name} x {product.quantity}
                      </span>
                      <span className="text-foreground font-semibold">
                        ₹{(product.price * product.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span className="text-foreground">
                      ₹{taxAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {shippingFee === 0 ? "Free" : `₹${shippingFee}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
