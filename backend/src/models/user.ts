export interface User {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  firebaseUid?: string;
}

export interface UserProfile extends User {
  totalBookings?: number;
  favoriteDestinations?: string[];
  preferences?: {
    budget?: string;
    travelStyle?: string;
    categories?: string[];
  };
}
