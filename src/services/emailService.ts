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
  const response = await fetch(`${import.meta.env.VITE_API_URL}/email/send-confirmation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error("Failed to send email");
  }

  return await response.json();
}