import { pgTable, serial, text, boolean, real, timestamp } from "drizzle-orm/pg-core";

export const bikeRentalsTable = pgTable("bike_rentals", {
  id: serial("id").primaryKey(),
  vendorName: text("vendor_name").notNull(),
  contact: text("contact").notNull(),
  bikeName: text("bike_name").notNull(),
  pricePerDay: real("price_per_day").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  availability: boolean("availability").default(true),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BikeRental = typeof bikeRentalsTable.$inferSelect;
export type InsertBikeRental = typeof bikeRentalsTable.$inferInsert;
