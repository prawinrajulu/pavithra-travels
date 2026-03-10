import { Link, useSearchParams } from "react-router";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { BackButton } from "../components/back-button";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const emailFailed = searchParams.get('emailFailed') === 'true';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            {emailFailed ? (
              <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            ) : (
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            )}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Booking Successful!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for choosing Pavithra Travels.
              {emailFailed ? (
                <span className="block mt-2 text-yellow-600 font-medium">
                  Booking saved but confirmation email could not be sent.
                </span>
              ) : (
                <span className="block mt-2">
                  A confirmation email with your Booking ID has been sent to your email address.
                </span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/trip-booking"
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <span>Book Another Trip</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}