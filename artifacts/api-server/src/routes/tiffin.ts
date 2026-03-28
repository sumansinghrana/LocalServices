import { Router, type IRouter } from "express";
import { db, tiffinServicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/tiffin", async (_req, res) => {
  const tiffin = await db.select().from(tiffinServicesTable)
    .where(eq(tiffinServicesTable.status, "active"))
    .orderBy(tiffinServicesTable.createdAt);
  res.json(tiffin);
});

router.get("/tiffin/all", async (_req, res) => {
  const tiffin = await db.select().from(tiffinServicesTable).orderBy(tiffinServicesTable.createdAt);
  res.json(tiffin);
});

router.post("/tiffin/:id/approve", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const updated = await db.update(tiffinServicesTable).set({ status: "active" }).where(eq(tiffinServicesTable.id, id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Tiffin service not found" }); return; }
  res.json({ success: true });
});

router.post("/tiffin/:id/reject", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const updated = await db.update(tiffinServicesTable).set({ status: "rejected" }).where(eq(tiffinServicesTable.id, id)).returning();
  if (updated.length === 0) { res.status(404).json({ error: "Tiffin service not found" }); return; }
  res.json({ success: true });
});

router.delete("/tiffin/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const deleted = await db.delete(tiffinServicesTable).where(eq(tiffinServicesTable.id, id)).returning();
  if (deleted.length === 0) { res.status(404).json({ error: "Tiffin service not found" }); return; }
  res.json({ success: true, message: "Tiffin service deleted" });
});

export default router;
