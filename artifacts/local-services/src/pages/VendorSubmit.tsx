import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVendorSubmit } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building, Wrench, CheckCircle2, Bike, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";
import { useSubmitBike, useSubmitTiffin } from "@/hooks/useConfig";
import { useSEO } from "@/hooks/useSEO";

type TabType = "service" | "room" | "bike" | "tiffin";

const serviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  serviceCategory: z.string().min(1, "Category is required"),
  serviceDescription: z.string().min(10, "Please describe what you do"),
});

const roomSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  roomTitle: z.string().min(3, "Property name is required"),
  roomType: z.enum(["pg", "hostel", "room"]),
  roomPrice: z.coerce.number().min(1, "Price is required"),
  roomLocation: z.string().min(5, "Location is required"),
});

const bikeSchema = z.object({
  vendorName: z.string().min(2, "Name is required"),
  contact: z.string().min(10, "Phone number is required"),
  bikeName: z.string().min(3, "Bike name is required"),
  pricePerDay: z.coerce.number().min(1, "Price is required"),
  location: z.string().min(5, "Location is required"),
  description: z.string().optional(),
});

const tiffinSchema = z.object({
  vendorName: z.string().min(2, "Name is required"),
  contact: z.string().min(10, "Phone number is required"),
  planType: z.enum(["1_time", "2_time", "3_time"]),
  price: z.coerce.number().min(1, "Price is required"),
  description: z.string().optional(),
  location: z.string().min(5, "Location is required"),
});

const tabs: { id: TabType; label: string; icon: any; color: string }[] = [
  { id: "service", label: "Service Provider", icon: Wrench, color: "text-orange-600" },
  { id: "room", label: "Room / PG", icon: Building, color: "text-teal-600" },
  { id: "bike", label: "Bike Rental", icon: Bike, color: "text-green-600" },
  { id: "tiffin", label: "Tiffin Service", icon: UtensilsCrossed, color: "text-red-600" },
];

export default function VendorSubmit() {
  useSEO(
    "Partner with Us — List your Service, PG, Bike or Tiffin",
    "List your service, PG, bike rental or tiffin business on localhelps.in and reach students near UPES Bidholi, Dehradun."
  );

  const [activeTab, setActiveTab] = useState<TabType>("service");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const submitBike = useSubmitBike();
  const submitTiffin = useSubmitTiffin();

  const serviceForm = useForm({ resolver: zodResolver(serviceSchema) });
  const roomForm = useForm({ resolver: zodResolver(roomSchema), defaultValues: { roomType: "pg" as const } });
  const bikeForm = useForm({ resolver: zodResolver(bikeSchema) });
  const tiffinForm = useForm({ resolver: zodResolver(tiffinSchema), defaultValues: { planType: "2_time" as const } });

  const { mutate: vendorSubmit, isPending: serviceLoading } = useVendorSubmit({
    mutation: {
      onSuccess: () => { setSubmitted(true); },
      onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." }),
    }
  });

  const onServiceSubmit = (data: any) => {
    vendorSubmit({ data: { ...data, submissionType: "service" } });
  };

  const onRoomSubmit = (data: any) => {
    vendorSubmit({ data: { name: data.name, phone: data.phone, submissionType: "room", roomTitle: data.roomTitle, roomType: data.roomType, roomPrice: data.roomPrice, roomLocation: data.roomLocation } });
  };

  const onBikeSubmit = (data: any) => {
    submitBike.mutate(data, {
      onSuccess: () => setSubmitted(true),
      onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." }),
    });
  };

  const onTiffinSubmit = (data: any) => {
    submitTiffin.mutate(data, {
      onSuccess: () => setSubmitted(true),
      onError: () => toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." }),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center border-none shadow-2xl">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4">Welcome Aboard!</h2>
          <p className="text-muted-foreground mb-8">
            Your submission has been sent to our team for review. We will contact you soon and get your listing live on localhelps.in.
          </p>
          <Button onClick={() => { setSubmitted(false); }} className="w-full">Submit Another</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-100px)] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold mb-4">Partner With Us</h1>
          <p className="text-lg text-muted-foreground">List your service or property on localhelps.in to reach students in Bidholi.</p>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 flex flex-col items-center justify-center gap-1.5 font-bold text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? `bg-primary/5 border-primary text-primary`
                    : "bg-white border-transparent text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary" : tab.color}`} />
                <span className="text-xs leading-tight text-center">{tab.label}</span>
              </button>
            ))}
          </div>

          <CardContent className="p-8 md:p-10 bg-white">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >

              {/* SERVICE PROVIDER */}
              {activeTab === "service" && (
                <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Your Name</label>
                      <Input {...serviceForm.register("name")} placeholder="John Doe" error={!!serviceForm.formState.errors.name} />
                      {serviceForm.formState.errors.name && <p className="text-xs text-destructive">{String(serviceForm.formState.errors.name.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Phone Number</label>
                      <Input {...serviceForm.register("phone")} type="tel" placeholder="9876543210" error={!!serviceForm.formState.errors.phone} />
                      {serviceForm.formState.errors.phone && <p className="text-xs text-destructive">{String(serviceForm.formState.errors.phone.message)}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Service Category</label>
                    <select {...serviceForm.register("serviceCategory")} className="flex h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10">
                      <option value="">Select category...</option>
                      <option value="repairs">Electrician / Plumber / Carpenter</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="painting">Painting</option>
                      <option value="moving">Packers & Movers</option>
                      <option value="other">Other</option>
                    </select>
                    {serviceForm.formState.errors.serviceCategory && <p className="text-xs text-destructive">{String(serviceForm.formState.errors.serviceCategory.message)}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">What exactly do you do?</label>
                    <textarea {...serviceForm.register("serviceDescription")} className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 min-h-[100px]" placeholder="e.g. I install fans, repair washing machines and ACs." />
                    {serviceForm.formState.errors.serviceDescription && <p className="text-xs text-destructive">{String(serviceForm.formState.errors.serviceDescription.message)}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-lg" isLoading={serviceLoading}>Submit Application</Button>
                </form>
              )}

              {/* ROOM / PG */}
              {activeTab === "room" && (
                <form onSubmit={roomForm.handleSubmit(onRoomSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Your Name</label>
                      <Input {...roomForm.register("name")} placeholder="John Doe" error={!!roomForm.formState.errors.name} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Phone Number</label>
                      <Input {...roomForm.register("phone")} type="tel" placeholder="9876543210" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Property Name / Title</label>
                    <Input {...roomForm.register("roomTitle")} placeholder="e.g. Sunrise PG for Boys" />
                    {roomForm.formState.errors.roomTitle && <p className="text-xs text-destructive">{String(roomForm.formState.errors.roomTitle.message)}</p>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Type</label>
                      <select {...roomForm.register("roomType")} className="flex h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary focus:outline-none">
                        <option value="pg">PG</option>
                        <option value="hostel">Hostel</option>
                        <option value="room">Independent Room</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Monthly Price (₹)</label>
                      <Input {...roomForm.register("roomPrice")} type="number" placeholder="5000" />
                      {roomForm.formState.errors.roomPrice && <p className="text-xs text-destructive">{String(roomForm.formState.errors.roomPrice.message)}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Exact Location</label>
                    <Input {...roomForm.register("roomLocation")} placeholder="Near Kandoli Campus, Bidholi" />
                    {roomForm.formState.errors.roomLocation && <p className="text-xs text-destructive">{String(roomForm.formState.errors.roomLocation.message)}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-lg" isLoading={serviceLoading}>Submit Application</Button>
                </form>
              )}

              {/* BIKE RENTAL */}
              {activeTab === "bike" && (
                <form onSubmit={bikeForm.handleSubmit(onBikeSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Your Name</label>
                      <Input {...bikeForm.register("vendorName")} placeholder="John Doe" error={!!bikeForm.formState.errors.vendorName} />
                      {bikeForm.formState.errors.vendorName && <p className="text-xs text-destructive">{String(bikeForm.formState.errors.vendorName.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Contact Number</label>
                      <Input {...bikeForm.register("contact")} type="tel" placeholder="9876543210" error={!!bikeForm.formState.errors.contact} />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Bike Name / Model</label>
                      <Input {...bikeForm.register("bikeName")} placeholder="e.g. Honda Activa 6G" />
                      {bikeForm.formState.errors.bikeName && <p className="text-xs text-destructive">{String(bikeForm.formState.errors.bikeName.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Price per Day (₹)</label>
                      <Input {...bikeForm.register("pricePerDay")} type="number" placeholder="200" />
                      {bikeForm.formState.errors.pricePerDay && <p className="text-xs text-destructive">{String(bikeForm.formState.errors.pricePerDay.message)}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Pickup Location</label>
                    <Input {...bikeForm.register("location")} placeholder="Near UPES Gate, Bidholi" />
                    {bikeForm.formState.errors.location && <p className="text-xs text-destructive">{String(bikeForm.formState.errors.location.message)}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Description (optional)</label>
                    <textarea {...bikeForm.register("description")} className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base focus:border-primary focus:outline-none min-h-[80px]" placeholder="Condition, fuel included, any conditions..." />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-lg" isLoading={submitBike.isPending}>Submit Bike Listing</Button>
                </form>
              )}

              {/* TIFFIN SERVICE */}
              {activeTab === "tiffin" && (
                <form onSubmit={tiffinForm.handleSubmit(onTiffinSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Your Name / Business Name</label>
                      <Input {...tiffinForm.register("vendorName")} placeholder="Ghar Ka Khana" error={!!tiffinForm.formState.errors.vendorName} />
                      {tiffinForm.formState.errors.vendorName && <p className="text-xs text-destructive">{String(tiffinForm.formState.errors.vendorName.message)}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Contact Number</label>
                      <Input {...tiffinForm.register("contact")} type="tel" placeholder="9876543210" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Meal Plan</label>
                      <select {...tiffinForm.register("planType")} className="flex h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary focus:outline-none">
                        <option value="1_time">1 Meal / Day</option>
                        <option value="2_time">2 Meals / Day</option>
                        <option value="3_time">3 Meals / Day</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Price per Day (₹)</label>
                      <Input {...tiffinForm.register("price")} type="number" placeholder="80" />
                      {tiffinForm.formState.errors.price && <p className="text-xs text-destructive">{String(tiffinForm.formState.errors.price.message)}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Service Area / Location</label>
                    <Input {...tiffinForm.register("location")} placeholder="Bidholi Campus Area, Dehradun" />
                    {tiffinForm.formState.errors.location && <p className="text-xs text-destructive">{String(tiffinForm.formState.errors.location.message)}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Menu / Description (optional)</label>
                    <textarea {...tiffinForm.register("description")} className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base focus:border-primary focus:outline-none min-h-[80px]" placeholder="e.g. Dal, rice, sabzi, roti — home-cooked food" />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 text-lg" isLoading={submitTiffin.isPending}>Submit Tiffin Listing</Button>
                </form>
              )}

            </motion.div>
            <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
              By submitting, you agree to our platform terms. We will review and contact you within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
