import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
const router = Router();
router.get("/", 
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
DoctorController.getALlDoctors);
router.get("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.getDoctorById);
router.patch("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDoctorZodSchema), DoctorController.updateDoctor);
router.delete("/:id",checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DoctorController.deleteDoctor);
export const doctorRouters = router;