import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";
import { commentController } from "./comment.controller";

const router = Router();

router.get("/author/:authorId", commentController.getCommentsByAuthor);
router.get("/:commentId", commentController.getSingleComment);
router.post("/", auth(Role.ADMIN, ), commentController.createComment);
router.patch("/:commentId", auth(Role.USER, Role.ADMIN), commentController.updateComment);
router.delete("/:commentId", auth(Role.USER, Role.ADMIN), commentController.deleteComment);
router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateComment);

export const commentRoutes = router;
