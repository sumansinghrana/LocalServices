import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const servicesConfigTable = pgTable("services_config", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
