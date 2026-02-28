import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();
router.post(
  "/create-doctor", 
  validateRequest(createDoctorZodSchema),
  userController.createDoctor,
);
export const userRouters = router;
