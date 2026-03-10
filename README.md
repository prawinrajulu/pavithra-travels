
  # Promotional design for travels

  This is a code bundle for Promotional design for travels. The original project is available at https://www.figma.com/design/WsQN2CnsjofmJNXtXe3NYC/Promotional-design-for-travels.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
## 📧 Email Notifications Setup

### Booking Confirmation Emails

Customers automatically receive booking confirmation emails with their Booking ID and a direct link to check booking status.

#### Setup Steps:

1. **Create EmailJS Account**
   ```bash
   # Visit https://www.emailjs.com/
   # Sign up and verify your email
   ```

2. **Configure Email Service**
   - Go to Email Services → Add New Service
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your email account
   - Note the Service ID

3. **Create Email Template**
   - Go to Email Templates → Create New Template
   - Use the template from `EMAILJS_SETUP.md`
   - Note the Template ID

4. **Get Public Key**
   - Go to Account → General
   - Copy your Public Key

5. **Update Environment Variables**
   ```bash
   # Edit .env file
   VITE_EMAILJS_SERVICE_ID=service_your_actual_service_id
   VITE_EMAILJS_TEMPLATE_ID=template_your_actual_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
   ```

6. **Test Email Service**
   ```bash
   npm run test-email
   ```

#### Email Features:
- ✅ Booking ID included
- ✅ Direct status check link
- ✅ Professional HTML template
- ✅ Customer contact details
- ✅ Booking confirmation details

#### Booking Status Checking:
- Visit `/booking-status` page
- Enter Booking ID (format: TRV-XXXXXX)
- View real-time booking status
- Status options: Pending, Confirmed, Completed, Cancelled  