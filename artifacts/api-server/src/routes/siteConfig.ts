import { Router, type IRouter } from "express";
import { db, siteConfigTable, servicesConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/config", async (_req, res) => {
  const rows = await db.select().from(siteConfigTable);
  const config: Record<string, string> = {};
  for (const row of rows) {
    config[row.key] = row.value;
  }
  res.json(config);
});

router.put("/config", async (req, res) => {
  const updates: Record<string, string> = req.body;
  if (!updates || typeof updates !== "object") {
    res.status(400).json({ error: "Body must be a key-value object" });
    return;
  }
  for (const [key, value] of Object.entries(updates)) {
    if (typeof value !== "string") continue;
    const existing = await db.select().from(siteConfigTable).where(eq(siteConfigTable.key, key));
    if (existing.length > 0) {
      await db.update(siteConfigTable).set({ value, updatedAt: new Date() }).where(eq(siteConfigTable.key, key));
    } else {
      await db.insert(siteConfigTable).values({ key, value });
    }
  }
  res.json({ success: true, message: "Config updated" });
});

router.get("/services-config", async (_req, res) => {
  const services = await db.select().from(servicesConfigTable).where(eq(servicesConfigTable.active, true));
  res.json(services);
});

router.post("/services-config", async (req, res) => {
  const { category, name } = req.body;
  if (!category || !name) {
    res.status(400).json({ error: "category and name are required" });
    return;
  }
  const service = await db.insert(servicesConfigTable).values({ category, name, active: true }).returning();
  res.status(201).json(service[0]);
});

router.delete("/services-config/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const deleted = await db.delete(servicesConfigTable).where(eq(servicesConfigTable.id, id)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Service not found" });
    return;
  }
  res.json({ success: true, message: "Service deleted" });
});

export default router;
