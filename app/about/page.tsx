import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckCircle, Award, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                About Sri Shaurya Medicals
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Revolutionizing healthcare by making quality medicines accessible,
                affordable, and convenient for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide authentic, affordable, and accessible healthcare
                  products to every individual. We believe that quality medicines
                  should be available at your doorstep with just a few clicks,
                  backed by expert pharmacist guidance.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become India's most trusted online pharmacy, setting new
                  standards in customer service, product quality, and healthcare
                  convenience. We aim to transform how people access medicines and
                  healthcare products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-card border-y border-border py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              Why Choose Sri Shaurya Medicals?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  100% Authentic
                </h3>
                <p className="text-sm text-muted-foreground">
                  Licensed pharmacy verified. Every medicine is genuine and source-traced.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  Fast Delivery
                </h3>
                <p className="text-sm text-muted-foreground">
                  24-48 hour delivery across the city with real-time tracking.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  Expert Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  24/7 assistance from qualified pharmacists and healthcare professionals.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-primary" size={32} />
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  Affordable Prices
                </h3>
                <p className="text-sm text-muted-foreground">
                  Best prices on all medicines with regular discounts and offers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
              Our Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Rajesh Kumar",
                  role: "Founder & Chief Pharmacist",
                  experience: "20+ years in pharmaceutical industry",
                },
                {
                  name: "Ms. Priya Sharma",
                  role: "Operations Manager",
                  experience: "15+ years in healthcare management",
                },
                {
                  name: "Mr. Amit Patel",
                  role: "Customer Care Head",
                  experience: "10+ years in customer service",
                },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-lg border border-border p-6 text-center"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">👨‍⚕️</span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-semibold mb-2">
                    {member.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.experience}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications & Compliance */}
        <section className="bg-card border-y border-border py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Certifications & Compliance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Licensed Pharmacy",
                "ISO 9001:2015 Certified",
                "DGFT Approved",
                "PAN & GST Registered",
              ].map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-background rounded-lg border border-border p-6 text-center"
                >
                  <CheckCircle className="text-primary mx-auto mb-3" size={32} />
                  <p className="font-bold text-foreground">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of customers who trust Sri Shaurya Medicals for their
              healthcare needs.
            </p>
            <a
              href="/shop"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
