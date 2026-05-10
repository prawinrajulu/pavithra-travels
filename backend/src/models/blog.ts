import { Timestamp } from 'firebase-admin/firestore';

export interface BlogMedia {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  uploadedAt: Date | Timestamp;
}

export interface BlogComment {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: Date | Timestamp;
  likes: number;
  likedBy: string[];
  replies?: BlogComment[];
}

export interface Blog {
  id: string;
  title: string;
  location: string;
  description: string;
  storyContent: string;
  category: string;
  tags: string[];
  coverImage: string;
  mediaFiles: BlogMedia[];
  likes: number;
  likedBy: string[];
  commentsCount: number;
  author: string;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}
