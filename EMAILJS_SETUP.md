# EmailJS Setup for Customer Booking Confirmations

This guide will help you set up EmailJS to send automatic booking confirmation emails to customers when they complete bookings.

## Prerequisites

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Verify your email address

## Step 1: Create an Email Service

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Click on "Email Services" in the left sidebar
3. Click "Add New Service"
4. Choose your email provider (Gmail, Outlook, etc.)
5. Connect your email account and give it a name (e.g., "Pavithra Travels")
6. Note down the **Service ID** (it will look like `service_xxxxxxxxxx`)

## Step 2: Create an Email Template

1. Click on "Email Templates" in the left sidebar
2. Click "Create New Template"
3. Set up the template with these variables:

### Template Settings:
- **Template Name**: Booking Confirmation
- **Subject**: Pavithra Travels Booking Confirmation

### Template Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation - Pavithra Travels</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .booking-details { background-color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .booking-id { background-color: #dbeafe; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .status-link { background-color: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pavithra Travels</h1>
            <p>Booking Confirmation</p>
        </div>

        <div class="content">
            <p>Hello {{customer_name}},</p>

            <p>Your travel booking has been successfully received.</p>

            <div class="booking-id">
                <strong>Booking ID: {{booking_id}}</strong>
            </div>

            <div class="booking-details">
                <h3>Booking Details:</h3>
                <p><strong>Destination:</strong> {{destination}}</p>
                <p><strong>Travel Date:</strong> {{travel_date}}</p>
                <p><strong>Passengers:</strong> {{passengers}}</p>
                <p><strong>Phone:</strong> {{booking_phone}}</p>
            </div>

            <p>Our team will contact you shortly to confirm your booking details and arrangements.</p>

            <p>You can check your booking status anytime using your Booking ID:</p>
            <a href="{{booking_status_link}}" class="status-link">Check Booking Status</a>

            <p>Thank you for choosing Pavithra Travels.</p>

            <div class="footer">
                <p>If you have any questions, please contact us at support@pavithratravels.com</p>
            </div>
        </div>
    </div>
</body>
</html>
```

4. Save the template and note down the **Template ID** (it will look like `template_xxxxxxxxxx`)

## Step 3: Get Your Public Key

1. Click on "Account" in the left sidebar
2. Find your **Public Key** (it will look like a long string of characters)
3. Note it down

## Step 4: Update Environment Variables

Update your `.env` file with the actual values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=template_your_actual_template_id
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## Step 5: Test the Setup

1. Start your development server
2. Make a test booking with a valid email address
3. Check the customer's email for the booking confirmation
4. Verify the booking ID and details are included

## Troubleshooting

### Email Not Sending
- Check that all environment variables are set correctly
- Verify your EmailJS account has email sending quota
- Check browser console for errors

### Template Variables Not Working
- Ensure the variable names in your template match exactly: `{{customer_name}}`, `{{booking_id}}`, etc.
- Check that the data is being passed correctly in the `sendBookingConfirmation` function

### Service Connection Issues
- Make sure your email service is properly connected in EmailJS
- Verify your email account credentials in EmailJS

## Security Notes

- Never commit your EmailJS keys to version control
- The `.env` file is already in `.gitignore`
- EmailJS has built-in rate limiting and security measures

## Support

For EmailJS support, visit: https://www.emailjs.com/docs/

## Step 4: Get Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key** (something like `xxxxxxxxxxxxxx`)

## Step 5: Update Environment Variables

Update your `.env` file with the EmailJS credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_your_service_id
VITE_EMAILJS_TEMPLATE_ID=template_your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_OWNER_EMAIL=your-email@example.com
```

## Step 6: Test the Setup

1. Start your development server
2. Make a test booking
3. Check your email for the booking notification

## Troubleshooting

- **Emails not sending**: Check your EmailJS dashboard for error logs
- **Template variables not working**: Ensure variable names match exactly (case-sensitive)
- **Service quota exceeded**: EmailJS free plan has limits - upgrade if needed

## Security Note

EmailJS public keys are safe to use in frontend code as they only allow sending emails through pre-configured templates.</content>
<parameter name="filePath">d:\pavithra-travels\EMAILJS_SETUP.md