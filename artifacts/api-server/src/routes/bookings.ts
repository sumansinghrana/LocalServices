import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBookingBody, DeleteBookingParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const booking = await db.insert(bookingsTable).values(parsed.data).returning();
  res.status(201).json(booking[0]);
});

router.get("/bookings", async (_req, res) => {
  const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
  res.json(bookings);
});

router.delete("/bookings/:id", async (req, res) => {
  const parsed = DeleteBookingParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const deleted = await db.delete(bookingsTable).where(eq(bookingsTable.id, parsed.data.id)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json({ success: true, message: "Booking deleted" });
});

export default router;
