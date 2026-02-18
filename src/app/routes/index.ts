import { Router } from "express";
import { SpecialtyRoute } from "../modules/Specialty/specialty.route";
import { AuthRoute } from "../modules/auth/auth.route";

const router = Router();
router.use("/auth", AuthRoute);
router.use("/specialty", SpecialtyRoute);


export const IndexRoute = router;
