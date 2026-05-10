export interface TravelPost {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  images?: string[]; // Keep as optional for backward compatibility
  createdAt: Date;
  updatedAt: Date;
}

export interface PostReview {
  id: string;
  postId: string;
  username: string;
  message: string;
  createdAt: Date;
}

