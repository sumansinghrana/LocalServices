import { Link } from "wouter";
import { ArrowRight, Wrench, Sparkles, Paintbrush, Home as HomeIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const categories = [
  {
    id: "repairs",
    title: "Electrician, Plumber & Carpenter",
    desc: "Fix leaks, wires, and furniture fast",
    icon: Wrench,
    image: "images/category-repairs.png",
    color: "bg-orange-100 text-orange-600",
  },
  {
    id: "cleaning",
    title: "Cleaning Services",
    desc: "Deep clean your room, bathroom, or entire flat",
    icon: Sparkles,
    image: "images/category-cleaning.png",
    color: "bg-teal-100 text-teal-600",
  },
  {
    id: "painting",
    title: "Painting & Waterproofing",
    desc: "Fresh walls and leak-free ceilings",
    icon: Paintbrush,
    image: "images/category-painting.png",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: "pg-hostel",
    title: "PG, Hostel & Rooms",
    desc: "Find your perfect stay near UPES",
    icon: HomeIcon,
    image: "images/category-pg.png",
    color: "bg-purple-100 text-purple-600",
    href: "/pg-hostel",
  },
];

export default function Home() {
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
                alt="Local services illustration" 
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
            <p className="text-lg text-muted-foreground font-medium">Select a category to explore our services</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={cat.href || `/services/${cat.id}`}>
                  <Card className="h-full group cursor-pointer border-transparent bg-muted/30 hover:bg-white transition-all duration-300">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-32 h-32 mb-6 relative transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 rounded-full blur-xl" />
                        <img src={`${import.meta.env.BASE_URL}${cat.image}`} alt={cat.title} className="w-full h-full object-contain relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                      <p className="text-muted-foreground font-medium">{cat.desc}</p>
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
