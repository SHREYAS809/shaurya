"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Upload, Check, AlertCircle } from "lucide-react";

export default function PrescriptionsPage() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      // Simulate file processing
      setTimeout(() => {
        setUploadedFile(file.name);
        setLoading(false);
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFile) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-green-600" size={32} />
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">
                Prescription Received!
              </h1>
              <p className="text-muted-foreground mb-6">
                Our pharmacist has received your prescription and will process it
                shortly. You'll receive confirmation via email and SMS.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  What happens next?
                </p>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>✓ Our pharmacist will verify your prescription</li>
                  <li>✓ We'll confirm availability of medicines</li>
                  <li>✓ You'll receive an order confirmation with pricing</li>
                  <li>✓ Medicines will be delivered within 24-48 hours</li>
                </ul>
              </div>

              <a
                href="/"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Upload Prescription
            </h1>
            <p className="text-muted-foreground">
              Have a prescription from your doctor? Upload it here and we'll help
              you get the medicines.
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Area */}
            <div className="bg-card rounded-lg border-2 border-dashed border-border p-12">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="text-primary" size={32} />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">
                  Upload your prescription
                </p>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Supported formats: JPG, PNG, PDF (Max 5MB)
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="hidden"
                />
                <span className="text-primary font-semibold hover:text-primary/80">
                  {loading ? "Uploading..." : "Choose file or drag and drop"}
                </span>
              </label>

              {uploadedFile && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <Check className="text-green-600" size={20} />
                  <span className="text-sm font-semibold text-green-700">
                    File uploaded: {uploadedFile}
                  </span>
                </div>
              )}
            </div>

            {/* Information */}
            <div className="space-y-4">
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Important Information</p>
                  <ul className="space-y-1">
                    <li>• Your prescription must be signed by a registered doctor</li>
                    <li>• Ensure all details are clearly visible and readable</li>
                    <li>• Our pharmacist will verify before processing</li>
                    <li>• Only prescription medicines will require a valid prescription</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <h2 className="font-bold text-foreground">Your Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="date"
                  required
                  className="px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <textarea
                placeholder="Any special instructions or notes for the pharmacist?"
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-border mt-1"
              />
              <span className="text-sm text-muted-foreground">
                I confirm that the prescription is from a registered medical
                practitioner and I have provided accurate information.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!uploadedFile}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                uploadedFile
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Submit Prescription
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our privacy policy and terms of service
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
