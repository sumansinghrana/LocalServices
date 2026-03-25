import { useState } from "react";
import { 
  useListBookings, useDeleteBooking, 
  useListListings, useDeleteListing,
  useListVendorSubmissions, useDeleteVendorSubmission 
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Lock, Calendar, Home, Users, Loader2, Settings, Wrench, Plus, Phone, MessageCircle, MapPin, FileText } from "lucide-react";
import { useSiteConfig, useServicesConfig, useUpdateConfig, useAddService, useDeleteService } from "@/hooks/useConfig";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "listings" | "vendors" | "settings" | "services">("bookings");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") setIsAuthenticated(true);
    else toast({ variant: "destructive", title: "Invalid password" });
  };

  // Data Hooks
  const { data: bookings, isLoading: loadingBookings } = useListBookings(undefined, { query: { enabled: isAuthenticated } });
  const { data: listings, isLoading: loadingListings } = useListListings(undefined, { query: { enabled: isAuthenticated } });
  const { data: vendors, isLoading: loadingVendors } = useListVendorSubmissions(undefined, { query: { enabled: isAuthenticated } });
  const { data: config, isLoading: loadingConfig } = useSiteConfig();
  const { data: services, isLoading: loadingServices } = useServicesConfig();

  // Delete Mutations
  const delBooking = useDeleteBooking({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/bookings"] }); toast({ title: "Deleted" }); }
    }
  });
  const delListing = useDeleteListing({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/listings"] }); toast({ title: "Deleted" }); }
    }
  });
  const delVendor = useDeleteVendorSubmission({
    mutation: {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/vendor-submissions"] }); toast({ title: "Deleted" }); }
    }
  });
  const updateConfig = useUpdateConfig();
  const addService = useAddService();
  const deleteService = useDeleteService();

  // Settings form state
  const [configForm, setConfigForm] = useState({ phone: "", whatsapp: "", location: "", tagline: "" });
  const [configLoaded, setConfigLoaded] = useState(false);
  if (config && !configLoaded) {
    setConfigForm({
      phone: config.phone || "",
      whatsapp: config.whatsapp || "",
      location: config.location || "",
      tagline: config.tagline || "",
    });
    setConfigLoaded(true);
  }

  // New service form state
  const [newService, setNewService] = useState({ category: "repairs", name: "" });

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig.mutateAsync(configForm);
      toast({ title: "Settings saved!", description: "Changes are now live on the website." });
    } catch {
      toast({ variant: "destructive", title: "Failed to save settings" });
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name.trim()) return;
    try {
      await addService.mutateAsync(newService);
      setNewService({ ...newService, name: "" });
      toast({ title: "Service added!" });
    } catch {
      toast({ variant: "destructive", title: "Failed to add service" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-muted/30">
        <Card className="max-w-md w-full p-8 shadow-2xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Enter password (admin123)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "listings", label: "PG/Hostels", icon: Home },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "settings", label: "Site Settings", icon: Settings },
    { id: "services", label: "Services", icon: Wrench },
  ] as const;

  const categoryLabels: Record<string, string> = {
    repairs: "Repairs & Maintenance",
    cleaning: "Cleaning Services",
    painting: "Painting & Waterproofing",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage marketplace data & settings</p>
        </div>
        <div className="flex flex-wrap gap-1 bg-white rounded-xl shadow-sm border border-border p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* BOOKINGS TABLE */}
      {activeTab === "bookings" && (
        <Card className="overflow-hidden border-none shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground font-bold uppercase text-xs tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingBookings && <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>}
                {!loadingBookings && !bookings?.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No bookings yet</td></tr>}
                {bookings?.map(b => (
                  <tr key={b.id} className="hover:bg-muted/30">
                    <td className="p-4 font-medium">{format(new Date(b.date), 'MMM dd, yyyy')}</td>
                    <td className="p-4">
                      <div className="font-bold">{b.name}</div>
                      <div className="text-muted-foreground text-xs">{b.phone}</div>
                    </td>
                    <td className="p-4"><span className="bg-secondary/10 text-secondary px-2 py-1 rounded font-bold text-xs">{b.service}</span></td>
                    <td className="p-4 max-w-[200px] truncate">{b.address}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => delBooking.mutate({ id: b.id })} disabled={delBooking.isPending}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* LISTINGS TABLE */}
      {activeTab === "listings" && (
        <Card className="overflow-hidden border-none shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground font-bold uppercase text-xs tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingListings && <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>}
                {!loadingListings && !listings?.length && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No listings yet</td></tr>}
                {listings?.map(l => (
                  <tr key={l.id} className="hover:bg-muted/30">
                    <td className="p-4 font-bold">{l.title}</td>
                    <td className="p-4 uppercase text-xs font-bold text-muted-foreground">{l.type}</td>
                    <td className="p-4 font-medium text-green-600">₹{l.price}/mo</td>
                    <td className="p-4">{l.contact}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => delListing.mutate({ id: l.id })} disabled={delListing.isPending}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* VENDORS TABLE */}
      {activeTab === "vendors" && (
        <Card className="overflow-hidden border-none shadow-xl bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground font-bold uppercase text-xs tracking-wider border-b border-border">
                <tr>
                  <th className="p-4">Provider</th>
                  <th className="p-4">Submission Type</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loadingVendors && <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>}
                {!loadingVendors && !vendors?.length && <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No vendor submissions yet</td></tr>}
                {vendors?.map(v => (
                  <tr key={v.id} className="hover:bg-muted/30">
                    <td className="p-4">
                      <div className="font-bold">{v.name}</div>
                      <div className="text-muted-foreground text-xs">{v.phone}</div>
                    </td>
                    <td className="p-4 uppercase text-xs font-bold">{v.submissionType}</td>
                    <td className="p-4 text-muted-foreground">
                      {v.submissionType === 'service' ? `${v.serviceCategory} - ${v.serviceDescription?.substring(0, 30)}...` : `${v.roomType} @ ₹${v.roomPrice}`}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" onClick={() => delVendor.mutate({ id: v.id })} disabled={delVendor.isPending}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* SITE SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-2xl">
          <Card className="border-none shadow-xl bg-white">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Site Settings
              </h2>
              <p className="text-muted-foreground text-sm mb-6">These details appear on the website — call/WhatsApp buttons, footer, and top banner.</p>
              {loadingConfig ? (
                <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
              ) : (
                <form onSubmit={handleSaveConfig} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" /> Phone Number
                    </label>
                    <Input
                      placeholder="+91-9999999999"
                      value={configForm.phone}
                      onChange={e => setConfigForm({ ...configForm, phone: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Used for the "Call Us" button on the website</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp Number
                    </label>
                    <Input
                      placeholder="919999999999 (with country code, no +)"
                      value={configForm.whatsapp}
                      onChange={e => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Enter number with country code but without + (e.g. 919876543210)</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" /> Service Location
                    </label>
                    <Input
                      placeholder="Bidholi, Dehradun"
                      value={configForm.location}
                      onChange={e => setConfigForm({ ...configForm, location: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Shown in the top banner and footer</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" /> Site Tagline
                    </label>
                    <Input
                      placeholder="Your trusted local marketplace in Bidholi"
                      value={configForm.tagline}
                      onChange={e => setConfigForm({ ...configForm, tagline: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">Short description shown in the footer</p>
                  </div>
                  <Button type="submit" className="w-full mt-2" isLoading={updateConfig.isPending}>
                    Save Settings
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* SERVICES MANAGEMENT */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* Add New Service */}
          <Card className="border-none shadow-xl bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Add New Service
              </h2>
              <form onSubmit={handleAddService} className="flex flex-col sm:flex-row gap-4">
                <select
                  value={newService.category}
                  onChange={e => setNewService({ ...newService, category: e.target.value })}
                  className="flex-shrink-0 rounded-xl border-2 border-border bg-white px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-primary"
                >
                  <option value="repairs">Repairs & Maintenance</option>
                  <option value="cleaning">Cleaning Services</option>
                  <option value="painting">Painting & Waterproofing</option>
                </select>
                <Input
                  placeholder="Service name (e.g. AC Repair)"
                  value={newService.name}
                  onChange={e => setNewService({ ...newService, name: e.target.value })}
                  className="flex-1"
                />
                <Button type="submit" isLoading={addService.isPending} className="shrink-0">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">New services will appear in the Services page and Booking dropdown immediately.</p>
            </CardContent>
          </Card>

          {/* Services List by Category */}
          {loadingServices ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(["repairs", "cleaning", "painting"] as const).map(cat => (
                <Card key={cat} className="border-none shadow-xl bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-base mb-4 pb-3 border-b border-border">{categoryLabels[cat]}</h3>
                    <div className="space-y-2">
                      {services?.filter(s => s.category === cat).map(s => (
                        <div key={s.id} className="flex items-center justify-between gap-2 py-2 px-3 bg-muted/40 rounded-lg">
                          <span className="text-sm font-medium">{s.name}</span>
                          <button
                            onClick={() => {
                              deleteService.mutate(s.id);
                              toast({ title: "Service removed" });
                            }}
                            className="text-destructive hover:text-destructive/70 transition-colors shrink-0"
                            title="Delete service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {!services?.filter(s => s.category === cat).length && (
                        <p className="text-sm text-muted-foreground py-2">No services yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
