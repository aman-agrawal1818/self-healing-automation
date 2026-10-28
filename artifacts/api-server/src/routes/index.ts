import { Router, type IRouter } from "express";
import healthRouter from "./health";
import healingRouter from "./healing";

const router: IRouter = Router();

router.use(healthRouter);
router.use(healingRouter);

export default router;
