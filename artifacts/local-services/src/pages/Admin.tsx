import { useState } from "react";
import { 
  useListBookings, useDeleteBooking, 
  useListListings, useDeleteListing, useCreateListing,
  useListVendorSubmissions, useDeleteVendorSubmission 
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Lock, Calendar, Home, Users, Loader2, Settings, Wrench, Plus, Phone, MessageCircle, MapPin, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useSiteConfig, useServicesConfig, useUpdateConfig, useAddService, useDeleteService } from "@/hooks/useConfig";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "listings" | "vendors" | "settings" | "services">("bookings");
  const [showAddListing, setShowAddListing] = useState(false);
  const [listingForm, setListingForm] = useState({
    title: "", type: "pg" as "pg" | "hostel" | "room",
    price: "", location: "", contact: "", description: "", imageUrl: ""
  });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) setIsAuthenticated(true);
      else toast({ variant: "destructive", title: "Invalid password" });
    } catch {
      toast({ variant: "destructive", title: "Could not connect to server" });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      toast({ variant: "destructive", title: "New passwords do not match" });
      return;
    }
    if (pwForm.next.length < 6) {
      toast({ variant: "destructive", title: "Password must be at least 6 characters" });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (res.ok) {
        toast({ title: "Password changed!", description: "Use your new password next time you log in." });
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        const data = await res.json();
        toast({ variant: "destructive", title: data.detail || "Failed to change password" });
      }
    } catch {
      toast({ variant: "destructive", title: "Could not connect to server" });
    } finally {
      setPwLoading(false);
    }
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
  const createListing = useCreateListing({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
        toast({ title: "Listing added!", description: "It is now visible on the PG/Hostels page." });
        setListingForm({ title: "", type: "pg", price: "", location: "", contact: "", description: "", imageUrl: "" });
        setShowAddListing(false);
      },
      onError: () => toast({ variant: "destructive", title: "Failed to add listing" }),
    }
  });

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title || !listingForm.price || !listingForm.location || !listingForm.contact) {
      toast({ variant: "destructive", title: "Please fill in all required fields" });
      return;
    }
    createListing.mutate({
      data: {
        title: listingForm.title,
        type: listingForm.type,
        price: parseFloat(listingForm.price),
        location: listingForm.location,
        contact: listingForm.contact,
        description: listingForm.description || undefined,
        imageUrl: listingForm.imageUrl || undefined,
      }
    });
  };
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
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" isLoading={loginLoading}>Login</Button>
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

      {/* LISTINGS TAB */}
      {activeTab === "listings" && (
        <div className="space-y-6">
          {/* Add New Listing */}
          <Card className="border-none shadow-xl bg-white">
            <CardContent className="p-6">
              <button
                onClick={() => setShowAddListing(!showAddListing)}
                className="flex w-full items-center justify-between"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" /> Add New PG / Hostel / Room Listing
                </h2>
                {showAddListing ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              {showAddListing && (
                <form onSubmit={handleAddListing} className="mt-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold">Title <span className="text-destructive">*</span></label>
                      <Input
                        placeholder="e.g. Sunrise PG for Boys"
                        value={listingForm.title}
                        onChange={e => setListingForm({ ...listingForm, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold">Type <span className="text-destructive">*</span></label>
                      <select
                        value={listingForm.type}
                        onChange={e => setListingForm({ ...listingForm, type: e.target.value as "pg" | "hostel" | "room" })}
                        className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-2.5 text-base focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="pg">PG</option>
                        <option value="hostel">Hostel</option>
                        <option value="room">Room</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold">Monthly Rent (₹) <span className="text-destructive">*</span></label>
                      <Input
                        type="number"
                        placeholder="e.g. 5500"
                        value={listingForm.price}
                        onChange={e => setListingForm({ ...listingForm, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold">Contact Number <span className="text-destructive">*</span></label>
                      <Input
                        placeholder="e.g. +91-9876543210"
                        value={listingForm.contact}
                        onChange={e => setListingForm({ ...listingForm, contact: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold">Location <span className="text-destructive">*</span></label>
                    <Input
                      placeholder="e.g. Near UPES Gate 1, Bidholi"
                      value={listingForm.location}
                      onChange={e => setListingForm({ ...listingForm, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold">Description</label>
                    <textarea
                      className="flex w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all min-h-[80px] resize-y"
                      placeholder="Describe the PG/Hostel (facilities, rules, amenities...)"
                      value={listingForm.description}
                      onChange={e => setListingForm({ ...listingForm, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-bold">Image URL <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <Input
                      placeholder="https://... or leave blank for default image"
                      value={listingForm.imageUrl}
                      onChange={e => setListingForm({ ...listingForm, imageUrl: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" isLoading={createListing.isPending} className="flex-1">
                      <Plus className="w-4 h-4 mr-1" /> Add Listing
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddListing(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Listings Table */}
          <Card className="overflow-hidden border-none shadow-xl bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted text-muted-foreground font-bold uppercase text-xs tracking-wider border-b border-border">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingListings && <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>}
                  {!loadingListings && !listings?.length && (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No listings yet. Add one above!</td></tr>
                  )}
                  {listings?.map(l => (
                    <tr key={l.id} className="hover:bg-muted/30">
                      <td className="p-4 font-bold max-w-[160px] truncate">{l.title}</td>
                      <td className="p-4">
                        <span className={`uppercase text-xs font-bold px-2 py-1 rounded ${
                          l.type === "pg" ? "bg-purple-100 text-purple-700" :
                          l.type === "hostel" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>{l.type}</span>
                      </td>
                      <td className="p-4 font-medium text-green-600">₹{l.price}/mo</td>
                      <td className="p-4 text-muted-foreground max-w-[150px] truncate">{l.location}</td>
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
        </div>
      )}

      {/* VENDORS TABLE */}
      {activeTab === "vendors" && (
        <div className="space-y-4">
          {loadingVendors && (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          )}
          {!loadingVendors && !vendors?.length && (
            <Card className="border-none shadow-xl bg-white">
              <CardContent className="p-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-medium">No partner applications yet.</p>
                <p className="text-sm mt-1">Submissions from "Partner with us" will appear here.</p>
              </CardContent>
            </Card>
          )}
          {vendors?.map(v => (
            <Card key={v.id} className="border-none shadow-xl bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${v.submissionType === 'service' ? 'bg-orange-500' : 'bg-teal-500'}`}>
                      {v.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{v.name}</h3>
                      <a href={`tel:${v.phone}`} className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
                        <Phone className="w-3 h-3" /> {v.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${v.submissionType === 'service' ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700'}`}>
                      {v.submissionType === 'service' ? '🔧 Service Provider' : '🏠 Room / PG Owner'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  {v.submissionType === 'service' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</span>
                        <span className="text-sm font-medium capitalize">{v.serviceCategory || '—'}</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</span>
                        <p className="text-sm mt-1 text-foreground">{v.serviceDescription || '—'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Property</span>
                        <p className="text-sm font-medium mt-0.5">{v.roomTitle || '—'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</span>
                        <p className="text-sm font-medium mt-0.5 capitalize">{v.roomType || '—'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rent</span>
                        <p className="text-sm font-medium mt-0.5 text-green-600">₹{v.roomPrice ?? '—'}/mo</p>
                      </div>
                      {v.roomLocation && (
                        <div className="sm:col-span-3 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" /> {v.roomLocation}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  <a href={`tel:${v.phone}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </Button>
                  </a>
                  <a href={`https://wa.me/${v.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline" className="gap-1 text-green-600 border-green-300 hover:bg-green-50">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                  </a>
                  {v.submissionType === 'room' && v.roomTitle && (
                    <Button
                      size="sm"
                      className="gap-1 bg-teal-600 hover:bg-teal-700"
                      onClick={() => {
                        createListing.mutate({
                          data: {
                            title: v.roomTitle!,
                            type: (v.roomType as "pg" | "hostel" | "room") || "room",
                            price: v.roomPrice ?? 0,
                            location: v.roomLocation || "",
                            contact: v.phone,
                          }
                        });
                      }}
                      isLoading={createListing.isPending}
                    >
                      <Plus className="w-3.5 h-3.5" /> Approve as Listing
                    </Button>
                  )}
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" onClick={() => delVendor.mutate({ id: v.id })} disabled={delVendor.isPending} className="text-destructive hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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

          {/* Change Password */}
          <Card className="border-none shadow-xl bg-white">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" /> Change Admin Password
              </h2>
              <p className="text-muted-foreground text-sm mb-6">Update your admin login password. You'll need your current password to set a new one.</p>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Current Password</label>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    value={pwForm.current}
                    onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">New Password</label>
                  <Input
                    type="password"
                    placeholder="Min. 6 characters"
                    value={pwForm.next}
                    onChange={e => setPwForm({ ...pwForm, next: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="Repeat new password"
                    value={pwForm.confirm}
                    onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full mt-2" isLoading={pwLoading}>
                  Update Password
                </Button>
              </form>
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
