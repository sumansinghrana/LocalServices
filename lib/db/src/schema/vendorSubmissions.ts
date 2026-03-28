import { pgTable, serial, text, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vendorSubmissionsTable = pgTable("vendor_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  submissionType: text("submission_type").notNull(),
  serviceCategory: text("service_category"),
  serviceDescription: text("service_description"),
  roomTitle: text("room_title"),
  roomPrice: real("room_price"),
  roomLocation: text("room_location"),
  roomType: text("room_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").default("pending"),
});

export const insertVendorSubmissionSchema = createInsertSchema(vendorSubmissionsTable).omit({ id: true, createdAt: true });
export type InsertVendorSubmission = z.infer<typeof insertVendorSubmissionSchema>;
export type VendorSubmission = typeof vendorSubmissionsTable.$inferSelect;
