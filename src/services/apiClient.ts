// API client for frontend
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const getApiUrl = () => {
  // Priority 1: Environment variable from Vite (BEST for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Priority 2: Relative path if in production (handles same-domain proxying)
  if (import.meta.env.PROD) {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Smart detection for Render: if frontend is xxx.onrender.com, 
      // see if we should try a different domain or just use relative /api
      // Note: Render Static Sites and Web Services are usually on different domains.
      if (hostname.endsWith('.onrender.com')) {
        console.warn('⚠️ No VITE_API_URL set. Attempting relative path /api, but if your backend is a separate Render Web Service, it will likely fail.');
      }
    }
    return '/api';
  }

  // Priority 3: Smart localhost detection for development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If we're on localhost but haven't specified a VITE_API_URL, 
    // assume backend is on port 3001
    return `http://${hostname}:3001/api`;
  }
  
  return 'http://127.0.0.1:3001/api';
};

const API_URL = import.meta.env.VITE_API_URL || getApiUrl();

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 500) {
          console.group('🚨 Backend 500 Error Diagnostic');
          console.error('URL:', error.config?.url);
          console.error('Data:', error.response?.data);
          console.groupEnd();
        }
        
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token but don't auto-redirect
          localStorage.removeItem('authToken');
          this.token = null;
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  // Authentication endpoints
  async register(email: string, password: string, displayName: string, phone?: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      displayName,
      phone
    });
    return response.data;
  }

  async login(token: string) {
    const response = await this.client.post('/auth/verify-token', { token });
    return response.data;
  }

  async verifyToken(token: string) {
    const response = await this.client.post('/auth/verify-token', { token });
    return response.data;
  }

  // User endpoints
  async getUserProfile() {
    const response = await this.client.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(updates: any) {
    const response = await this.client.put('/users/profile', updates);
    return response.data;
  }

  async getUser(userId: string) {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  // Booking endpoints
  async createBooking(booking: any) {
    const response = await this.client.post('/bookings', booking);
    return response.data;
  }

  async getBookings() {
    const response = await this.client.get('/bookings');
    return response.data;
  }

  async getMyBookings() {
    const response = await this.client.get('/bookings/my');
    return response.data;
  }

  async getBookingsByPhone(phone: string) {
    console.log(`[API CLIENT] Fetching bookings for Phone: ${phone}`);
    const response = await this.client.get(`/bookings/user/${phone}`);
    return response.data;
  }

  async getBookingStatus(bookingId: string) {
    const response = await this.client.get(`/bookings/status/${bookingId}`);
    return response.data;
  }

  async updateBookingStatus(bookingId: string, status: string) {
    const response = await this.client.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  }

  async getBooking(bookingId: string) {
    const response = await this.client.get(`/bookings/${bookingId}`);
    return response.data;
  }

  async updateBooking(bookingId: string, updates: any) {
    const response = await this.client.put(`/bookings/${bookingId}`, updates);
    return response.data;
  }

  async cancelBooking(bookingId: string) {
    const response = await this.client.post(`/bookings/${bookingId}/cancel`);
    return response.data;
  }

  // Destination endpoints
  async getDestinations() {
    const response = await this.client.get('/destinations');
    return response.data;
  }

  async getDestination(destinationId: string) {
    const response = await this.client.get(`/destinations/${destinationId}`);
    return response.data;
  }

  async getDestinationsByCategory(category: string) {
    const response = await this.client.get(`/destinations/category/${category}`);
    return response.data;
  }

  async getDestinationsByRegion(region: string) {
    const response = await this.client.get(`/destinations/region/${region}`);
    return response.data;
  }

  async filterDestinations(filters: any) {
    const response = await this.client.post('/destinations/filter', filters);
    return response.data;
  }

  // Chatbot endpoints
  async getOrCreateConversation(conversationId?: string, userId?: string) {
    const params = new URLSearchParams();
    if (conversationId) params.append('conversationId', conversationId);
    if (userId) params.append('userId', userId);

    const response = await this.client.get(`/chatbot/conversation?${params}`);
    return response.data;
  }

  async getUserConversations() {
    const response = await this.client.get('/chatbot/conversations');
    return response.data;
  }

  async sendChatMessage(message: string, conversationId?: string, userId?: string) {
    const response = await this.client.post('/chatbot/message', {
      message,
      conversationId,
      userId,
    });
    return response.data;
  }

  async archiveConversation(conversationId: string) {
    const response = await this.client.post(`/chatbot/conversation/${conversationId}/archive`);
    return response.data;
  }

  // Admin endpoints
  async getWhatsAppStatus() {
    const response = await this.client.get('/admin/whatsapp/status');
    return response.data;
  }

  async sendTestWhatsApp(to: string, message: string) {
    const response = await this.client.post('/admin/whatsapp/test', { to, message });
    return response.data;
  }

  // Image / Unsplash endpoints
  async searchUnsplashImages(query: string, page: number = 1, perPage: number = 20) {
    const response = await this.client.get('/images/unsplash/search', {
      params: { query, page, perPage }
    });
    return response.data;
  }

  async triggerUnsplashDownload(downloadLocation: string) {
    const response = await this.client.post('/images/unsplash/trigger-download', { downloadLocation });
    return response.data;
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  async dbHealthCheck() {
    const response = await this.client.get('/health/db');
    return response.data;
  }
}

export const apiClient = new ApiClient();
