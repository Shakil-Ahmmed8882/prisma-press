import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware";
import { Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

// GET /api/posts           — public
router.get("/", postController.getAllPosts);

// GET /api/posts/stats     — user, admin (must be before /:postId)
router.get("/stats", auth(Role.USER, Role.ADMIN), postController.getPostStats);

// GET /api/posts/my-posts  — user, admin (must be before /:postId)
router.get("/my-posts", auth(Role.USER, Role.ADMIN), postController.getMyPosts);

// GET /api/posts/:postId   — public
router.get("/:postId", postController.getSinglePost);

// POST /api/posts          — user, admin
router.post("/", auth(Role.USER, Role.ADMIN), postController.createPost);

// PATCH /api/posts/:postId — user, admin
router.patch("/:postId", auth(Role.USER, Role.ADMIN), postController.updatePost);

// DELETE /api/posts/:postId — user, admin
router.delete("/:postId", auth(Role.USER, Role.ADMIN), postController.deletePost);

export const postRoutes = router;
