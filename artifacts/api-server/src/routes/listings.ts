import { Router, type IRouter } from "express";
import { db, listingsTable } from "@workspace/db";
import { eq, gte, lte, and, type SQL } from "drizzle-orm";
import { CreateListingBody, DeleteListingParams, ListListingsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/listings", async (req, res) => {
  const parsed = CreateListingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const listing = await db.insert(listingsTable).values(parsed.data).returning();
  res.status(201).json(listing[0]);
});

router.get("/listings", async (req, res) => {
  const parsed = ListListingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { type, minPrice, maxPrice } = parsed.data;
  const conditions: SQL[] = [];
  if (type) conditions.push(eq(listingsTable.type, type));
  if (minPrice !== undefined) conditions.push(gte(listingsTable.price, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(listingsTable.price, maxPrice));

  const listings = conditions.length > 0
    ? await db.select().from(listingsTable).where(and(...conditions)).orderBy(listingsTable.createdAt)
    : await db.select().from(listingsTable).orderBy(listingsTable.createdAt);

  res.json(listings);
});

router.delete("/listings/:id", async (req, res) => {
  const parsed = DeleteListingParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const deleted = await db.delete(listingsTable).where(eq(listingsTable.id, parsed.data.id)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  res.json({ success: true, message: "Listing deleted" });
});

export default router;
