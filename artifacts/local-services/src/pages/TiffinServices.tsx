import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, MapPin, Phone, MessageCircle, Loader2, Sun, Sunset, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTiffin } from "@/hooks/useConfig";
import { useSEO } from "@/hooks/useSEO";

const planMeta: Record<string, { label: string; icon: any; color: string; bg: string; meals: string }> = {
  "1_time": { label: "1 Meal / Day", icon: Sunset, color: "text-orange-600", bg: "bg-orange-50", meals: "Dinner" },
  "2_time": { label: "2 Meals / Day", icon: Sun, color: "text-yellow-600", bg: "bg-yellow-50", meals: "Lunch + Dinner" },
  "3_time": { label: "3 Meals / Day", icon: Clock, color: "text-red-600", bg: "bg-red-50", meals: "Breakfast + Lunch + Dinner" },
};

export default function TiffinServices() {
  useSEO(
    "Tiffin Service near UPES Bidholi Dehradun",
    "Get home-cooked tiffin delivered daily near UPES Bidholi campus, Dehradun. Choose 1, 2 or 3 meals/day plans starting from ₹60."
  );

  const { data: tiffins, isLoading } = useTiffin();

  // Group by vendor for better display
  const byVendor = tiffins
    ? tiffins.reduce<Record<string, typeof tiffins>>((acc, t) => {
        const key = `${t.vendorName}__${t.contact}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(t);
        return acc;
      }, {})
    : {};

  return (
    <div className="bg-muted/20 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold">Tiffin Services</h1>
            </div>
            <p className="text-xl text-muted-foreground">Home-cooked meals delivered near UPES Bidholi</p>
          </div>
          <Link href="/vendor-submit">
            <Button variant="outline" className="shrink-0">List Your Tiffin</Button>
          </Link>
        </div>

        {/* Plan overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {Object.entries(planMeta).map(([key, plan]) => (
            <div key={key} className={`${plan.bg} rounded-2xl p-5 flex items-center gap-4`}>
              <plan.icon className={`w-8 h-8 ${plan.color} shrink-0`} />
              <div>
                <p className={`font-bold ${plan.color}`}>{plan.label}</p>
                <p className="text-xs text-muted-foreground">{plan.meals}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tiffin vendors */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : Object.keys(byVendor).length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-border">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No tiffin services listed yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to list your tiffin service!</p>
            <Link href="/vendor-submit">
              <Button>List Your Tiffin</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(byVendor).map(([vendorKey, plans], vi) => {
              const [vendorName, contact] = vendorKey.split("__");
              const location = plans[0]?.location || "";
              return (
                <motion.div
                  key={vendorKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: vi * 0.1 }}
                >
                  <Card className="border-none shadow-md bg-white overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-red-400 to-orange-400" />
                    <CardContent className="p-6">
                      {/* Vendor header */}
                      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg shrink-0">
                            {vendorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-xl">{vendorName}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-red-400" />
                              {location}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a href={`tel:${contact}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <Phone className="w-3.5 h-3.5" /> Call
                            </Button>
                          </a>
                          <a href={`https://wa.me/${contact.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                            <Button size="sm" className="gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white">
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                            </Button>
                          </a>
                        </div>
                      </div>

                      {/* Plans grid */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        {plans.map(plan => {
                          const meta = planMeta[plan.planType] || planMeta["1_time"];
                          return (
                            <div key={plan.id} className={`${meta.bg} rounded-2xl p-5`}>
                              <div className="flex items-center gap-2 mb-3">
                                <meta.icon className={`w-5 h-5 ${meta.color}`} />
                                <span className={`font-bold text-sm ${meta.color}`}>{meta.label}</span>
                              </div>
                              <div className="text-2xl font-extrabold text-foreground mb-1">₹{plan.price}<span className="text-sm font-normal text-muted-foreground">/day</span></div>
                              {plan.description && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-3">{plan.description}</p>
                              )}
                              <Link href={`/book?service=${encodeURIComponent("Tiffin: " + meta.label + " from " + vendorName)}`} className="block mt-4">
                                <Button size="sm" className="w-full">Order Now</Button>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
