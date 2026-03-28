import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";

export const tiffinServicesTable = pgTable("tiffin_services", {
  id: serial("id").primaryKey(),
  vendorName: text("vendor_name").notNull(),
  contact: text("contact").notNull(),
  planType: text("plan_type").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TiffinService = typeof tiffinServicesTable.$inferSelect;
export type InsertTiffinService = typeof tiffinServicesTable.$inferInsert;
