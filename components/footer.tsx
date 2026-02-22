import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-foreground mb-4">About Sri Shaurya</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted online pharmacy providing authentic medicines and healthcare products with fast delivery.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-primary hover:text-primary/80">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary hover:text-primary/80">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/prescriptions" className="text-muted-foreground hover:text-primary">
                  Upload Prescription
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Business</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Inquiries & Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Sri Shaurya
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 text-muted-foreground">
                <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <span>Unit-2, Main Street, Medical Complex</span>
              </li>
              <li className="flex gap-2 text-muted-foreground">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary">
                  +91 9876543210
                </a>
              </li>
              <li className="flex gap-2 text-muted-foreground">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <a href="mailto:info@srishaurya.com" className="hover:text-primary">
                  info@srishaurya.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Sri Shaurya Medicals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
