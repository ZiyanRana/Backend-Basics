import { Router } from 'express';
import { createPost, deletePost, updatePost , viewPosts, viewPost } from '../../controllers/post.controller.js';
import multer from 'multer';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const postRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

postRouter.post('/create', authMiddleware, upload.single('image'), createPost);

postRouter.delete('/delete/:id', authMiddleware, deletePost);

postRouter.put('/update/:id', authMiddleware, upload.single('image'), updatePost);

postRouter.get('/view', authMiddleware, viewPosts);

postRouter.get('/view/:id', authMiddleware, viewPost);

export default postRouter;