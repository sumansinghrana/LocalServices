import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Loader2, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useServicesConfig, useProviders } from "@/hooks/useConfig";
import { useSEO } from "@/hooks/useSEO";

const categoryMeta: Record<string, { title: string; desc: string; seoTitle: string; seoDesc: string }> = {
  repairs: {
    title: "Repairs & Maintenance",
    desc: "Expert electricians, plumbers, and carpenters at your doorstep in Bidholi.",
    seoTitle: "Electrician & Plumber in Bidholi Dehradun near UPES",
    seoDesc: "Book trusted electricians, plumbers and carpenters near UPES Bidholi, Dehradun. Same-day service available.",
  },
  cleaning: {
    title: "Cleaning Services",
    desc: "Professional cleaning for a spotless living space near UPES.",
    seoTitle: "Home Cleaning Services near UPES Bidholi Dehradun",
    seoDesc: "Professional home, sofa, and kitchen cleaning services near UPES Bidholi. Book online on localhelps.in.",
  },
  painting: {
    title: "Painting & Waterproofing",
    desc: "Transform your space with fresh colors and leak-free walls.",
    seoTitle: "Painting & Waterproofing in Bidholi Dehradun",
    seoDesc: "Wall painting and waterproofing services near UPES campus Bidholi. Affordable rates, verified professionals.",
  },
  moving: {
    title: "Packers & Movers",
    desc: "Shift your belongings safely anywhere in Dehradun.",
    seoTitle: "Packers and Movers near UPES Bidholi Dehradun",
    seoDesc: "Reliable packers and movers, bike transport and mini truck rental near UPES Bidholi, Dehradun.",
  },
};

export default function Services() {
  const { category } = useParams<{ category: string }>();
  const { data: services, isLoading } = useServicesConfig(category);
  const { data: providers } = useProviders(category);

  const meta = category ? categoryMeta[category] : undefined;

  useSEO(
    meta?.seoTitle || (category ? `${category} services near UPES Bidholi` : "Services"),
    meta?.seoDesc
  );

  if (!meta && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Category not found</h2>
        <Link href="/"><Button className="mt-4">Go Back Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-200px)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Categories
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">{meta?.title}</h1>
          <p className="text-xl text-muted-foreground">{meta?.desc}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : services && services.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col border-none shadow-sm hover:shadow-xl transition-shadow bg-white">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-primary font-bold" />
                      </div>
                      <h3 className="text-xl font-bold leading-tight">{service.name}</h3>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <Link href={`/book?service=${encodeURIComponent(service.name)}`}>
                        <Button className="w-full font-bold">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No services available in this category yet.</p>
          </div>
        )}

        {/* Verified Partners Section */}
        {providers && providers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-14"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold">Our Verified Partners</h2>
            </div>
            <p className="text-muted-foreground mb-6 -mt-2">
              These local professionals have been verified by localhelps.in. Contact them directly.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {providers.map((provider, i) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {provider.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg leading-tight truncate">{provider.name}</h3>
                            <span className="flex-shrink-0 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">✓ Verified</span>
                          </div>
                          {provider.serviceCategory && (
                            <span className="text-xs text-muted-foreground font-medium capitalize">{provider.serviceCategory}</span>
                          )}
                        </div>
                      </div>
                      {provider.serviceDescription && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{provider.serviceDescription}</p>
                      )}
                      <div className="flex gap-2 pt-3 border-t border-border">
                        <a href={`tel:${provider.phone}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Call
                          </Button>
                        </a>
                        <a href={`https://wa.me/${provider.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1">
                          <Button size="sm" variant="outline" className="w-full gap-1.5 text-green-600 border-green-300 hover:bg-green-50">
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </Button>
                        </a>
                        <Link href={`/book?service=${encodeURIComponent(provider.serviceCategory || '')}&provider=${encodeURIComponent(provider.name)}`} className="flex-1">
                          <Button size="sm" className="w-full">Book</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
