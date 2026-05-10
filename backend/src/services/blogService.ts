import { db, storage } from '../config/firebase.js';
import { Blog, BlogComment, BlogMedia } from '../models/blog.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class BlogService {
  private collection = db.collection('blogs');

  async createBlog(blogData: Partial<Blog>): Promise<Blog> {
    const id = uuidv4();
    const blog: Blog = {
      id,
      title: blogData.title || '',
      location: blogData.location || '',
      description: blogData.description || '',
      storyContent: blogData.storyContent || '',
      category: blogData.category || 'General',
      tags: blogData.tags || [],
      coverImage: blogData.coverImage || '',
      mediaFiles: blogData.mediaFiles || [],
      likes: 0,
      likedBy: [],
      commentsCount: 0,
      author: blogData.author || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.collection.doc(id).set(blog);
    return blog;
  }

  async getAllBlogs(): Promise<Blog[]> {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Blog);
  }

  async getBlogById(id: string): Promise<Blog | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as Blog) : null;
  }

  async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
    const blogRef = this.collection.doc(id);
    const doc = await blogRef.get();
    
    if (!doc.exists) {
      throw new AppError(404, 'Blog not found');
    }

    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await blogRef.update(updateData);
    const updated = await blogRef.get();
    return updated.data() as Blog;
  }

  async deleteBlog(id: string): Promise<void> {
    // Delete media from storage first
    try {
      const [files] = await storage.bucket().getFiles({ prefix: `travel-blogs/${id}/` });
      await Promise.all(files.map(file => file.delete()));
    } catch (err) {
      console.error('Error deleting blog media:', err);
    }
    
    await this.collection.doc(id).delete();
  }

  async toggleLike(blogId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    const blogRef = this.collection.doc(blogId);
    const doc = await blogRef.get();
    
    if (!doc.exists) throw new AppError(404, 'Blog not found');
    
    const blog = doc.data() as Blog;
    const likedBy = blog.likedBy || [];
    const isLiked = likedBy.includes(userId);
    
    let newLikedBy;
    if (isLiked) {
      newLikedBy = likedBy.filter(id => id !== userId);
    } else {
      newLikedBy = [...likedBy, userId];
    }
    
    const newLikes = newLikedBy.length;
    await blogRef.update({ 
      likes: newLikes, 
      likedBy: newLikedBy 
    });
    
    return { likes: newLikes, liked: !isLiked };
  }

  // Comments
  async addComment(blogId: string, commentData: Partial<BlogComment>): Promise<BlogComment> {
    const blogRef = this.collection.doc(blogId);
    const commentId = uuidv4();
    
    const comment: BlogComment = {
      id: commentId,
      userId: commentData.userId || '',
      username: commentData.username || 'Anonymous',
      message: commentData.message || '',
      likes: 0,
      likedBy: [],
      createdAt: new Date(),
    };

    await blogRef.collection('comments').doc(commentId).set(comment);
    
    // Update comment count
    const blogDoc = await blogRef.get();
    const currentCount = (blogDoc.data() as Blog).commentsCount || 0;
    await blogRef.update({ commentsCount: currentCount + 1 });
    
    return comment;
  }

  async getComments(blogId: string): Promise<BlogComment[]> {
    const snapshot = await this.collection.doc(blogId).collection('comments').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as BlogComment);
  }
}

export const blogService = new BlogService();
