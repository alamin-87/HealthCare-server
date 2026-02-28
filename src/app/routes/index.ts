import { Router } from "express";
import { SpecialtyRoute } from "../modules/Specialty/specialty.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRouters } from "../modules/user/user.route";
import { doctorRouters } from "../modules/doctor/doctor.route";

const router = Router();
router.use("/auth", AuthRoute);
router.use("/specialty", SpecialtyRoute);
router.use("/users", userRouters);
router.use("/doctors", doctorRouters);

export const IndexRoute = router;
