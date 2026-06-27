import { Router } from "express";
import { userController } from "./users.controller";
import { auth } from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();


router.post('/register', userController.registerUser);

router.get('/me', auth(Role.USER, Role.AUTHOR, Role.ADMIN), userController.getMyProfile);

router.patch('/update-profile', auth(Role.USER, Role.AUTHOR, Role.ADMIN), userController.updateMyProfile);

router.patch('/update-password', auth(Role.USER, Role.AUTHOR, Role.ADMIN), userController.updateMyPassword);


export const userRoutes = router;
