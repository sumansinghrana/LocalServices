import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`p-4 rounded-xl shadow-xl border backdrop-blur-md pointer-events-auto ${
              t.variant === 'destructive' 
                ? 'bg-destructive text-destructive-foreground border-destructive/20' 
                : 'bg-white/90 text-foreground border-border'
            }`}
          >
            <h4 className="font-bold text-sm">{t.title}</h4>
            {t.description && <p className="text-sm opacity-90 mt-1">{t.description}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
