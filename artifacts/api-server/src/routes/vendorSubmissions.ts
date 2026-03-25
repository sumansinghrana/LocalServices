import { Router, type IRouter } from "express";
import { db, vendorSubmissionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { VendorSubmitBody, DeleteVendorSubmissionParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/vendor-submit", async (req, res) => {
  const parsed = VendorSubmitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.insert(vendorSubmissionsTable).values(parsed.data).returning();
  res.status(201).json({ success: true, message: "Submission received. We will contact you soon!" });
});

router.get("/vendor-submissions", async (_req, res) => {
  const submissions = await db.select().from(vendorSubmissionsTable).orderBy(vendorSubmissionsTable.createdAt);
  res.json(submissions);
});

router.delete("/vendor-submissions/:id", async (req, res) => {
  const parsed = DeleteVendorSubmissionParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const deleted = await db.delete(vendorSubmissionsTable).where(eq(vendorSubmissionsTable.id, parsed.data.id)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }
  res.json({ success: true, message: "Submission deleted" });
});

export default router;
