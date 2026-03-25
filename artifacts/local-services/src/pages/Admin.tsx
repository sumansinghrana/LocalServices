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
import { Trash2, Lock, Calendar, Home, Users, Loader2 } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "listings" | "vendors">("bookings");
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
    { id: "vendors", label: "Vendor Apps", icon: Users },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage marketplace data</p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-border p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-xl bg-white">
        <div className="overflow-x-auto">
          {/* BOOKINGS TABLE */}
          {activeTab === "bookings" && (
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
          )}

          {/* LISTINGS TABLE */}
          {activeTab === "listings" && (
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
                {listings?.map(l => (
                  <tr key={l.id} className="hover:bg-muted/30">
                    <td className="p-4 font-bold">{l.title}</td>
                    <td className="p-4 uppercase text-xs font-bold text-muted-foreground">{l.type}</td>
                    <td className="p-4 font-medium text-green-600">₹{l.price}</td>
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
          )}

          {/* VENDORS TABLE */}
          {activeTab === "vendors" && (
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
          )}
        </div>
      </Card>
    </div>
  );
}
