import { Link, useLocation } from "wouter";
import { MapPin, Phone, MessageCircle, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pg-hostel", label: "PG & Hostels" },
    { href: "/vendor-submit", label: "Partner with us" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Top Banner */}
      <div className="bg-secondary text-secondary-foreground py-2 px-4 text-sm font-medium flex justify-center items-center gap-2">
        <MapPin className="w-4 h-4" />
        Serving Bidholi & UPES Area, Dehradun
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                LS
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                Local<span className="text-primary">Services</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-semibold text-[15px] transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/book">
                <Button className="rounded-full px-6">Book a Service</Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 pb-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-display font-bold ${
                  location === link.href ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
              <Button size="lg" className="w-full mt-4">Book a Service</Button>
            </Link>
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="mt-auto text-muted-foreground font-medium text-center">
              Admin Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-display font-bold text-xl text-foreground">
              Local<span className="text-primary">Services</span>.com
            </span>
            <p className="text-muted-foreground mt-2 font-medium">Your trusted local marketplace in Bidholi.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <a
          href="tel:+919999999999"
          className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg shadow-secondary/30 hover:scale-110 transition-transform duration-300"
          title="Call Us"
        >
          <Phone className="w-6 h-6" />
        </a>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300"
          title="WhatsApp Us"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
}
