import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useVendorSubmit, VendorSubmitInputSubmissionType, VendorSubmitInputRoomType } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building, Wrench, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  submissionType: z.enum(["service", "room"]),
  // Service fields
  serviceCategory: z.string().optional(),
  serviceDescription: z.string().optional(),
  // Room fields
  roomTitle: z.string().optional(),
  roomType: z.enum(["pg", "hostel", "room"]).optional(),
  roomPrice: z.coerce.number().optional(),
  roomLocation: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function VendorSubmit() {
  const [type, setType] = useState<"service" | "room">("service");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      submissionType: "service",
    },
  });

  // Watch submissionType to sync state
  const watchType = form.watch("submissionType");
  if (watchType !== type) setType(watchType);

  const { mutate, isPending, isSuccess } = useVendorSubmit({
    mutation: {
      onSuccess: () => {
        toast({ title: "Submission Received!", description: "We will review your listing shortly." });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to submit. Please try again." });
      }
    }
  });

  const onSubmit = (data: FormValues) => {
    // API expects specifically typed enum values
    const payload = {
      ...data,
      submissionType: data.submissionType as VendorSubmitInputSubmissionType,
      roomType: data.roomType as VendorSubmitInputRoomType | undefined
    };
    mutate({ data: payload });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-10 text-center border-none shadow-2xl">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold mb-4">Welcome Aboard!</h2>
          <p className="text-muted-foreground mb-8">
            Your submission has been sent to our team for review. We will contact you soon.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">Submit Another</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-100px)] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold mb-4">Partner With Us</h1>
          <p className="text-lg text-muted-foreground">List your service or property on LocalServices to reach students in Bidholi.</p>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => form.setValue("submissionType", "service")}
              className={`flex-1 py-5 flex items-center justify-center gap-3 font-bold text-lg transition-colors ${type === 'service' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'bg-white text-muted-foreground hover:bg-muted/50'}`}
            >
              <Wrench className="w-5 h-5" /> I offer a Service
            </button>
            <button
              type="button"
              onClick={() => form.setValue("submissionType", "room")}
              className={`flex-1 py-5 flex items-center justify-center gap-3 font-bold text-lg transition-colors ${type === 'room' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'bg-white text-muted-foreground hover:bg-muted/50'}`}
            >
              <Building className="w-5 h-5" /> I have a Room/PG
            </button>
          </div>

          <CardContent className="p-8 md:p-10 bg-white">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Common Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Name</label>
                  <Input {...form.register("name")} placeholder="John Doe" error={!!form.formState.errors.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Phone Number</label>
                  <Input {...form.register("phone")} type="tel" placeholder="9876543210" error={!!form.formState.errors.phone} />
                </div>
              </div>

              <motion.div
                key={type}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {type === "service" ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Service Category</label>
                      <select 
                        {...form.register("serviceCategory")}
                        className="flex h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                      >
                        <option value="">Select category...</option>
                        <option value="repairs">Electrician / Plumber / Carpenter</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="painting">Painting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">What exactly do you do?</label>
                      <textarea 
                        {...form.register("serviceDescription")}
                        className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 min-h-[100px]"
                        placeholder="e.g. I install fans, repair washing machines, etc."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">Property Name / Title</label>
                      <Input {...form.register("roomTitle")} placeholder="e.g. Sunrise PG for Boys" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Type</label>
                        <select 
                          {...form.register("roomType")}
                          className="flex h-12 w-full rounded-xl border-2 border-border bg-white px-4 py-2 font-medium focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                        >
                          <option value="pg">PG</option>
                          <option value="hostel">Hostel</option>
                          <option value="room">Independent Room</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold">Monthly Price (₹)</label>
                        <Input {...form.register("roomPrice")} type="number" placeholder="5000" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold">Exact Location</label>
                      <Input {...form.register("roomLocation")} placeholder="Near Kandoli Campus, Bidholi" />
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="pt-6">
                <Button type="submit" size="lg" className="w-full text-lg h-14" isLoading={isPending}>
                  Submit Application
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
                  By submitting, you agree to our platform terms.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
