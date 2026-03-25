import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useServicesConfig } from "@/hooks/useConfig";

const categoryMeta: Record<string, { title: string; desc: string }> = {
  repairs: {
    title: "Repairs & Maintenance",
    desc: "Expert electricians, plumbers, and carpenters at your doorstep.",
  },
  cleaning: {
    title: "Cleaning Services",
    desc: "Professional cleaning for a spotless living space.",
  },
  painting: {
    title: "Painting & Waterproofing",
    desc: "Transform your space with fresh colors.",
  },
};

export default function Services() {
  const { category } = useParams<{ category: string }>();
  const { data: services, isLoading } = useServicesConfig(category);

  const meta = category ? categoryMeta[category] : undefined;

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
      </div>
    </div>
  );
}
