import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type SiteConfig = {
  phone?: string;
  whatsapp?: string;
  location?: string;
  tagline?: string;
  [key: string]: string | undefined;
};

export type ServiceItem = {
  id: number;
  category: string;
  name: string;
  active: boolean;
  createdAt: string;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function useSiteConfig() {
  return useQuery<SiteConfig>({
    queryKey: ["site-config"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/config`);
      if (!res.ok) throw new Error("Failed to fetch config");
      return res.json();
    },
    staleTime: 30000,
  });
}

export function useServicesConfig(category?: string) {
  return useQuery<ServiceItem[]>({
    queryKey: ["services-config", category],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/services-config`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const all: ServiceItem[] = await res.json();
      return category ? all.filter((s) => s.category === category) : all;
    },
    staleTime: 30000,
  });
}

export function useUpdateConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: SiteConfig) => {
      const res = await fetch(`${BASE}/api/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to update config");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-config"] }),
  });
}

export function useAddService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { category: string; name: string }) => {
      const res = await fetch(`${BASE}/api/services-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add service");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services-config"] }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE}/api/services-config/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services-config"] }),
  });
}

export type Provider = {
  id: number;
  name: string;
  phone: string;
  submissionType: string;
  serviceCategory?: string;
  serviceDescription?: string;
  status: string;
  createdAt: string;
};

export function useProviders(category?: string) {
  return useQuery<Provider[]>({
    queryKey: ["providers", category],
    queryFn: async () => {
      const url = category
        ? `${BASE}/api/providers?category=${encodeURIComponent(category)}`
        : `${BASE}/api/providers`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch providers");
      return res.json();
    },
    staleTime: 30000,
  });
}

export function useApproveVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE}/api/vendor-submissions/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to approve vendor");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vendor-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
}

export function useRejectVendor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${BASE}/api/vendor-submissions/${id}/reject`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to reject vendor");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/vendor-submissions"] }),
  });
}
