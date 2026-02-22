"use client";

import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/stores/cart-store";

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  description: string;
  requires_prescription: boolean;
  stock: number;
  image: string;
  onAddToCart?: (id: number | string, quantity: number) => void;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  description,
  requires_prescription,
  stock,
  image,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      quantity,
      image
    });

    if (onAddToCart) {
      onAddToCart(id, quantity);
    }

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="glass-card rounded-[1.5rem] overflow-hidden border border-border/50 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-56 bg-secondary/50 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 h-full w-full"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/5 to-secondary/30">
            <span className="text-5xl opacity-30">💊</span>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {discount > 0 && (
          <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold text-primary border-primary/20">
            {discount}% OFF
          </div>
        )}
        {requires_prescription && (
          <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
            Prescription
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Category & Rating */}
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-primary/80 uppercase font-heavy tracking-widest">
            {requires_prescription ? "Secure Rx" : "Quick OTC"}
          </p>
          <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-0.5 rounded-full">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-bold text-yellow-700">{rating}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>

        {/* Price & Stock */}
        <div className="flex flex-col gap-1 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-heavy text-foreground">₹{price}</span>
            {originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through opacity-60">
                ₹{originalPrice}
              </span>
            )}
          </div>
          <div className="text-[11px] font-medium">
            {stock > 10 ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ready to Ship
              </span>
            ) : stock > 0 ? (
              <span className="text-orange-500">Low Stock: {stock} left</span>
            ) : (
              <span className="text-red-500 font-bold uppercase tracking-tighter">Temporarily Unavailable</span>
            )}
          </div>
        </div>

        {/* Add to Cart Premium */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${isAdded
              ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg"
              : stock === 0
                ? "bg-muted text-muted-foreground cursor-not-allowed grayscale"
                : "btn-primary-premium text-sm"
              }`}
          >
            {isAdded ? (
              <span className="animate-in fade-in slide-in-from-bottom-2">✓ Added to Cart</span>
            ) : (
              <>
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
