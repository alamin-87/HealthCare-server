import { Router } from "express";
import { SpecialtyRoute } from "../modules/Specialty/specialty.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { userRouters } from "../modules/user/user.route";

const router = Router();
router.use("/auth", AuthRoute);
router.use("/specialty", SpecialtyRoute);
router.use("/users", userRouters);

export const IndexRoute = router;
