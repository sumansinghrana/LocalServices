import { useState, useEffect } from "react";

// Minimal toast implementation to avoid missing shadcn dependencies
// In a full app, this connects to a Toaster provider
type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

let memoryToasts: ToastProps[] = [];
let listeners: Function[] = [];

export function toast(props: ToastProps) {
  memoryToasts.push(props);
  listeners.forEach(l => l([...memoryToasts]));
  setTimeout(() => {
    memoryToasts = memoryToasts.filter(t => t !== props);
    listeners.forEach(l => l([...memoryToasts]));
  }, 3000);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter(l => l !== setToasts);
    };
  }, []);

  return { toast, toasts };
}
