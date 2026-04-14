import axios from 'axios';
import { config } from '../config/env.js';

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download: string;
    download_location: string;
  };
}

class UnsplashService {
  private accessKey: string;
  private baseUrl: string = 'https://api.unsplash.com';

  constructor() {
    this.accessKey = config.unsplash.accessKey;
    if (!this.accessKey) {
      console.warn('⚠️ UNSPLASH_ACCESS_KEY is missing in backend environment!');
    }
  }

  async searchPhotos(query: string, page: number = 1, perPage: number = 20) {
    if (!this.accessKey) {
      throw new Error('Unsplash API key is not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search/photos`, {
        params: {
          query,
          page,
          per_page: perPage,
          orientation: 'landscape'
        },
        headers: {
          Authorization: `Client-ID ${this.accessKey}`
        }
      });

      // Track download for Unsplash API compliance
      // Note: You should trigger the download_location endpoint when an image is selected/used
      
      return response.data;
    } catch (error: any) {
      console.error('Unsplash Search Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0] || 'Failed to search Unsplash');
    }
  }

  async triggerDownload(downloadLocation: string) {
    if (!this.accessKey) return;
    try {
      await axios.get(downloadLocation, {
        headers: {
          Authorization: `Client-ID ${this.accessKey}`
        }
      });
    } catch (error) {
      console.error('Unsplash Download Trigger Error:', error);
    }
  }
}

export const unsplashService = new UnsplashService();
