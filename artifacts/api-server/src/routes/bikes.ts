import { Router, type IRouter } from "express";
import { db, bikeRentalsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/bikes", async (_req, res) => {
  const bikes = await db.select().from(bikeRentalsTable)
    .where(eq(bikeRentalsTable.status, "active"))
    .orderBy(bikeRentalsTable.createdAt);
  res.json(bikes);
});

router.get("/bikes/all", async (_req, res) => {
  const bikes = await db.select().from(bikeRentalsTable).orderBy(bikeRentalsTable.createdAt);
  res.json(bikes);
});

router.post("/bikes/:id/approve", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const updated = await db.update(bikeRentalsTable).set({ status: "active" }).where(eq(bikeRentalsTable.id, id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Bike not found" }); return; }
  res.json({ success: true });
});

router.post("/bikes/:id/reject", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const updated = await db.update(bikeRentalsTable).set({ status: "rejected" }).where(eq(bikeRentalsTable.id, id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Bike not found" }); return; }
  res.json({ success: true });
});

router.delete("/bikes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const deleted = await db.delete(bikeRentalsTable).where(eq(bikeRentalsTable.id, id)).returning();
  if (deleted.length === 0) { res.status(404).json({ error: "Bike not found" }); return; }
  res.json({ success: true, message: "Bike deleted" });
});

export default router;
