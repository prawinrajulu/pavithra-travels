// API client for frontend
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
        if (error.response?.status === 401) {
          // Handle unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
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
  async register(email: string, password: string, displayName: string) {
    const response = await this.client.post('/auth/register', {
      email,
      password,
      displayName,
    });
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
