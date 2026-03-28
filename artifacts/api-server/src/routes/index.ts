import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import listingsRouter from "./listings";
import vendorSubmissionsRouter from "./vendorSubmissions";
import siteConfigRouter from "./siteConfig";
import adminRouter from "./admin";
import bikesRouter from "./bikes";
import tiffinRouter from "./tiffin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(listingsRouter);
router.use(vendorSubmissionsRouter);
router.use(siteConfigRouter);
router.use(adminRouter);
router.use(bikesRouter);
router.use(tiffinRouter);

export default router;
