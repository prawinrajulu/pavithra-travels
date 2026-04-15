// Example of using the API client in a component
import { useEffect, useState } from 'react';
import { apiClient } from './apiClient';

// Example: Getting all destinations
export function DestinationsList() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getDestinations();
        setDestinations(response.destinations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {destinations.map((dest) => (
        <div key={dest.id}>
          <h3>{dest.name}</h3>
          <p>{dest.description}</p>
        </div>
      ))}
    </div>
  );
}

// Example: Creating a booking
export async function createNewBooking(bookingData: any) {
  try {
    const token = apiClient.getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await apiClient.createBooking(bookingData);
    return response.booking;
  } catch (error) {
    console.error('Booking creation failed:', error);
    throw error;
  }
}

// Example: Getting user profile
export async function fetchUserProfile() {
  try {
    const response = await apiClient.getUserProfile();
    return response.user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
}

// Example: Sending chat message
export async function sendChatMessage(message: string, conversationId?: string) {
  try {
    const response = await apiClient.sendChatMessage(message, conversationId);
    return response.response;
  } catch (error) {
    console.error('Chat message failed:', error);
    throw error;
  }
}
