import cookieParser from "cookie-parser";
import express,  {type Application, type Request, type Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.routes";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.routes";
import { commentRoutes } from "./modules/comment/comment.routes";
const app : Application = express(); 


app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



    // app.post('/api/users/register', )
    app.use('/api/users', userRoutes);
    app.use('/api/auth', AuthRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/comments', commentRoutes);
export default app;