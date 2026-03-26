import { Link } from "wouter";
import { ArrowRight, Wrench, Sparkles, Paintbrush, Home as HomeIcon, CheckCircle2, Bike, UtensilsCrossed, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

const categories = [
  {
    id: "repairs",
    title: "Electrician, Plumber & Carpenter",
    desc: "Fix leaks, wires, and furniture fast",
    icon: Wrench,
    color: "bg-orange-100 text-orange-600",
    href: "/services/repairs",
    emoji: "🔧",
  },
  {
    id: "cleaning",
    title: "Cleaning Services",
    desc: "Deep clean your room, bathroom, or entire flat",
    icon: Sparkles,
    color: "bg-teal-100 text-teal-600",
    href: "/services/cleaning",
    emoji: "🧹",
  },
  {
    id: "painting",
    title: "Painting & Waterproofing",
    desc: "Fresh walls and leak-free ceilings",
    icon: Paintbrush,
    color: "bg-yellow-100 text-yellow-600",
    href: "/services/painting",
    emoji: "🎨",
  },
  {
    id: "moving",
    title: "Packers & Movers",
    desc: "Shift your belongings safely and quickly",
    icon: Truck,
    color: "bg-blue-100 text-blue-600",
    href: "/services/moving",
    emoji: "🚛",
  },
  {
    id: "pg-hostel",
    title: "PG, Hostel & Rooms",
    desc: "Find your perfect stay near UPES",
    icon: HomeIcon,
    color: "bg-purple-100 text-purple-600",
    href: "/pg-hostel",
    emoji: "🏠",
  },
  {
    id: "bike-rental",
    title: "Bike Rental",
    desc: "Rent a bike for a day or week near campus",
    icon: Bike,
    color: "bg-green-100 text-green-600",
    href: "/bike-rental",
    emoji: "🏍️",
  },
  {
    id: "tiffin",
    title: "Tiffin Services",
    desc: "Home-cooked meals delivered daily",
    icon: UtensilsCrossed,
    color: "bg-red-100 text-red-600",
    href: "/tiffin",
    emoji: "🍱",
  },
];

export default function Home() {
  useSEO(
    "Electrician, PG, Bike Rental & Tiffin near UPES Bidholi Dehradun",
    "Book electricians, plumbers, PG rooms, bike rentals and tiffin services near UPES Bidholi, Dehradun. LocalHelps.in — your trusted hyperlocal platform."
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                #1 Trusted in Bidholi
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6">
                Your reliable local help, <span className="text-gradient">just a click away.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 font-medium leading-relaxed">
                From fixing a leaky tap to finding the perfect PG. We connect you with trusted professionals right here in the UPES area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/book">
                  <Button size="lg" className="w-full sm:w-auto text-lg rounded-full px-8">
                    Book a Service <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pg-hostel">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg rounded-full bg-white">
                    Find a Room
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm font-bold text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Verified Pros</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Quick Service</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500"/> Fair Prices</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] transform rotate-3 scale-105" />
              <img
                src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
                alt="Local services near UPES Bidholi Dehradun"
                className="relative rounded-[3rem] shadow-2xl w-full h-auto object-cover border-8 border-white"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What do you need help with?</h2>
            <p className="text-lg text-muted-foreground font-medium">Select a category to explore services near UPES Bidholi</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link href={cat.href}>
                  <Card className="h-full group cursor-pointer border-transparent bg-muted/30 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className={`w-16 h-16 mb-5 rounded-2xl ${cat.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1`}>
                        <cat.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold font-display mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                      <p className="text-muted-foreground text-sm font-medium">{cat.desc}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
