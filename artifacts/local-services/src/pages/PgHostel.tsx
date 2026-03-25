import { useState } from "react";
import { useListListings, ListListingsType } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Phone, MessageCircle, Home, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PgHostel() {
  const [filterType, setFilterType] = useState<ListListingsType | "all">("all");
  
  const { data: listings, isLoading } = useListListings(
    filterType === "all" ? undefined : { type: filterType }
  );

  return (
    <div className="bg-muted/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">PG, Hostels & Rooms</h1>
            <p className="text-xl text-muted-foreground">Find the perfect stay near UPES Bidholi</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-border/50 self-start md:self-auto overflow-x-auto w-full md:w-auto">
            {["all", "pg", "hostel", "room"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm capitalize transition-all whitespace-nowrap ${
                  filterType === type 
                    ? "bg-primary text-white shadow-md" 
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : !listings || listings.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-border">
            <Home className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No listings found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full flex flex-col group border-transparent hover:border-primary/20">
                  {/* Image Placeholder */}
                  <div className="relative h-64 bg-muted overflow-hidden">
                    {listing.imageUrl ? (
                      <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                        <Home className="w-16 h-16 text-indigo-200" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary shadow-sm border border-white">
                      {listing.type}
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className="text-2xl font-bold font-display leading-tight">{listing.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-extrabold text-primary">{formatCurrency(listing.price)}</span>
                        <span className="text-xs text-muted-foreground block font-bold uppercase tracking-wide">/ month</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground font-medium text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-2 shrink-0 text-secondary" />
                      <span className="truncate">{listing.location}</span>
                    </div>

                    {listing.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6 bg-muted/30 p-3 rounded-lg border border-border/50">
                        {listing.description}
                      </p>
                    )}
                    
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-border">
                      <a href={`tel:${listing.contact}`} className="w-full">
                        <Button variant="outline" className="w-full gap-2 border-2">
                          <Phone className="w-4 h-4" /> Call
                        </Button>
                      </a>
                      <a href={`https://wa.me/${listing.contact.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25D366]/20">
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </Button>
                      </a>
                    </div>
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
