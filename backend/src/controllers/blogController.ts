import { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blogService.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export const blogController = {
  createBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await blogService.createBlog(req.body);
      res.status(201).json({ success: true, blog });
    } catch (error) {
      next(error);
    }
  },

  getAllBlogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await blogService.getAllBlogs();
      res.json({ success: true, blogs });
    } catch (error) {
      next(error);
    }
  },

  getBlogById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const blog = await blogService.getBlogById(id);
      if (!blog) return next(new AppError(404, 'Blog not found'));
      res.json({ success: true, blog });
    } catch (error) {
      next(error);
    }
  },

  updateBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const blog = await blogService.updateBlog(id, req.body);
      res.json({ success: true, blog });
    } catch (error) {
      next(error);
    }
  },

  deleteBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await blogService.deleteBlog(id);
      res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  toggleLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      const userId = authReq.user?.uid;
      if (!userId) return next(new AppError(401, 'Unauthorized'));

      const result = await blogService.toggleLike(id, userId);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },

  addComment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const authReq = req as AuthRequest;
      const userId = authReq.user?.uid;
      const username = authReq.user?.name;

      if (!userId) return next(new AppError(401, 'Unauthorized'));

      const comment = await blogService.addComment(id, {
        ...req.body,
        userId,
        username: username || req.body.username || 'Anonymous'
      });
      res.status(201).json({ success: true, comment });
    } catch (error) {
      next(error);
    }
  },

  getComments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const comments = await blogService.getComments(id);
      res.json({ success: true, comments });
    } catch (error) {
      next(error);
    }
  }
};
