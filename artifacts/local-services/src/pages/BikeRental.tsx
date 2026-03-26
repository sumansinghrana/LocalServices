import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bike, MapPin, Phone, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useBikes } from "@/hooks/useConfig";
import { useSEO } from "@/hooks/useSEO";

export default function BikeRental() {
  useSEO(
    "Bike Rental near UPES Bidholi Dehradun",
    "Rent bikes near UPES Bidholi campus, Dehradun. Daily rental from ₹150/day. Book online on localhelps.in."
  );

  const { data: bikes, isLoading } = useBikes();

  return (
    <div className="bg-muted/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <Bike className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold">Bike Rental</h1>
            </div>
            <p className="text-xl text-muted-foreground">Rent a bike near UPES Bidholi for a day, week or month</p>
          </div>
          <Link href="/vendor-submit">
            <Button variant="outline" className="shrink-0">List Your Bike</Button>
          </Link>
        </div>

        {/* Info Strip */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "🏍️", title: "Various Models", desc: "Scooters, bikes & more" },
            { icon: "💰", title: "Affordable Rates", desc: "Starting from ₹150/day" },
            { icon: "📍", title: "Near Campus", desc: "Pickup near UPES Bidholi" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bikes Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : !bikes || bikes.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-border">
            <Bike className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No bikes listed yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to list your bike!</p>
            <Link href="/vendor-submit">
              <Button>List Your Bike</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bikes.map((bike, i) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full flex flex-col border-none shadow-md hover:shadow-xl transition-shadow bg-white">
                  {/* Top color band */}
                  <div className="h-3 bg-gradient-to-r from-green-400 to-teal-500 rounded-t-xl" />
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                          <Bike className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{bike.bikeName}</h3>
                          <p className="text-xs text-muted-foreground font-medium">{bike.vendorName}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-extrabold text-primary">₹{bike.pricePerDay}</span>
                        <span className="text-xs text-muted-foreground block font-bold">/day</span>
                      </div>
                    </div>

                    {bike.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 bg-muted/30 p-3 rounded-lg">
                        {bike.description}
                      </p>
                    )}

                    <div className="flex items-center text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-2 shrink-0 text-green-500" />
                      <span className="truncate">{bike.location}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-700">Available Now</span>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border">
                      <a href={`tel:${bike.contact}`} className="w-full">
                        <Button variant="outline" className="w-full gap-2 border-2">
                          <Phone className="w-4 h-4" /> Call
                        </Button>
                      </a>
                      <a href={`https://wa.me/${bike.contact.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="w-full">
                        <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white">
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </Button>
                      </a>
                    </div>

                    <Link href={`/book?service=${encodeURIComponent("Bike Rental: " + bike.bikeName)}`} className="mt-3">
                      <Button variant="outline" className="w-full">Book This Bike</Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
