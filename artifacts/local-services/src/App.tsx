import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";

// Pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Book from "@/pages/Book";
import PgHostel from "@/pages/PgHostel";
import VendorSubmit from "@/pages/VendorSubmit";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services/:category" component={Services} />
        <Route path="/book" component={Book} />
        <Route path="/pg-hostel" component={PgHostel} />
        <Route path="/vendor-submit" component={VendorSubmit} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
