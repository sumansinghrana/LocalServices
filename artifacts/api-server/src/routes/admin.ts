import { Router, type IRouter } from "express";
import { db, siteConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/admin/verify", async (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Password is required" });
    return;
  }
  const row = await db.select().from(siteConfigTable).where(eq(siteConfigTable.key, "admin_password"));
  const stored = row[0]?.value ?? "admin123";
  if (password === stored) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

router.post("/admin/change-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "currentPassword and newPassword are required" });
    return;
  }
  const row = await db.select().from(siteConfigTable).where(eq(siteConfigTable.key, "admin_password"));
  const stored = row[0]?.value ?? "admin123";
  if (currentPassword !== stored) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }
  if (row.length > 0) {
    await db.update(siteConfigTable).set({ value: newPassword, updatedAt: new Date() }).where(eq(siteConfigTable.key, "admin_password"));
  } else {
    await db.insert(siteConfigTable).values({ key: "admin_password", value: newPassword });
  }
  res.json({ success: true, message: "Password updated" });
});

export default router;
