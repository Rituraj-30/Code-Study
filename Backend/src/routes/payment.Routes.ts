import { Router } from "express";

import { capturePayment, verifyPayment } from "../controllers/Payment.Controller";
import { authenticateUser, isStudent } from "../middlewares/auth.middlewares";

const router = Router();


router.post("/capturePayment", authenticateUser, isStudent, capturePayment);
router.post("/verifyPayment", authenticateUser, isStudent, verifyPayment);


export default router;
