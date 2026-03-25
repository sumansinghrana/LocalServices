import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  service: z.string().min(2, "Please specify the service"),
  date: z.string().min(1, "Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Book() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialService = searchParams.get("service") || "";
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      service: initialService,
      date: "",
    },
  });

  const { mutate, isPending, isSuccess } = useCreateBooking({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Booking Confirmed! 🎉",
          description: "We'll contact you shortly to confirm details.",
        });
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Booking Failed",
          description: "Please try again later.",
        });
      }
    }
  });

  const onSubmit = (data: FormValues) => {
    mutate({ data });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <Card className="p-10 border-none shadow-2xl">
            <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4">Request Received!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for choosing LocalServices. Our professional will be in touch with you shortly.
            </p>
            <Button size="lg" onClick={() => setLocation("/")} className="w-full">
              Back to Home
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold mb-4">Book a Service</h1>
        <p className="text-lg text-muted-foreground">Fill out the details below and we'll handle the rest.</p>
      </div>

      <Card className="border-none shadow-xl bg-white/50 backdrop-blur-xl">
        <CardContent className="p-8 md:p-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Full Name</label>
                <Input 
                  placeholder="Rahul Kumar" 
                  {...form.register("name")} 
                  error={!!form.formState.errors.name}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Phone Number</label>
                <Input 
                  placeholder="9876543210" 
                  type="tel"
                  {...form.register("phone")} 
                  error={!!form.formState.errors.phone}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Service Required</label>
              <Input 
                placeholder="e.g. Geyser Repair, Full Home Cleaning" 
                {...form.register("service")} 
                error={!!form.formState.errors.service}
              />
               {form.formState.errors.service && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.service.message}</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Preferred Date</label>
              <div className="relative">
                <Input 
                  type="date" 
                  {...form.register("date")} 
                  error={!!form.formState.errors.date}
                  className="pl-12"
                />
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
               {form.formState.errors.date && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.date.message}</p>
                )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Full Address (Bidholi / UPES Area)</label>
              <textarea 
                className={`flex w-full rounded-xl border-2 bg-white px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all duration-200 min-h-[100px] resize-y ${form.formState.errors.address ? 'border-destructive' : 'border-border'}`}
                placeholder="Room no, Hostel/PG name, Landmark"
                {...form.register("address")}
              />
               {form.formState.errors.address && (
                  <p className="text-sm text-destructive font-medium">{form.formState.errors.address.message}</p>
                )}
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14 mt-4" isLoading={isPending}>
              Confirm Booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
