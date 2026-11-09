import { apiClient } from './apiClient';

export async function sendBookingConfirmation(data: {
  to_email: string;
  customer_name: string;
  destination: string;
  travel_date: string;
  passengers: number;
  booking_id: string;
  booking_phone: string;
  special_requests?: string;
}) {
  return await apiClient.sendBookingConfirmation(data);
}