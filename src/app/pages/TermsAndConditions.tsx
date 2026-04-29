import { useEffect } from "react";
import { Link } from "react-router-dom";

export function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-[#E2E8F0]">
        <div className="bg-[#701C1C] py-10 px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-[Cinzel] font-bold text-[#FDFBF7] tracking-wider mb-2">
            Terms & Conditions
          </h1>
          <p className="text-amber-200/80 text-sm max-w-2xl mx-auto">
            Please read these terms carefully before booking your journey with Pavithra Travels.
          </p>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-[#D4AF37] rounded-full"></div>
              <h2 className="text-2xl font-semibold text-[#0B1221]">Reservation Policy</h2>
            </div>
            <p className="text-[#475569] leading-relaxed pl-4 border-l-2 border-gray-100">
              Confirmation of hotel rooms is subject to the availability.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-[#D4AF37] rounded-full"></div>
              <h2 className="text-2xl font-semibold text-[#0B1221]">Payment Policy</h2>
            </div>
            <ul className="space-y-3 pl-4 border-l-2 border-gray-100">
              {[
                "Pay 10% at the time of booking",
                "Pay 25% before 60 days of travel date",
                "Pay 65% before 30 days of travel date",
                "Pay 100% before 7 days of travel date"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#701C1C] flex-shrink-0"></span>
                  <span className="text-[#475569] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-1 bg-[#D4AF37] rounded-full"></div>
              <h2 className="text-2xl font-semibold text-[#0B1221]">Cancellation Policy</h2>
            </div>
            <ul className="space-y-3 pl-4 border-l-2 border-gray-100 mb-6">
              {[
                "If cancelled 45 days before date of travel 15% cancellation charges are applicable",
                "If cancelled 30 days before date of travel 25% cancellation charges are applicable",
                "If cancelled 15 days before date of travel 50% cancellation charges are applicable",
                "If cancelled 7 days before date of travel 75% cancellation charges are applicable",
                "If cancelled 6 days before date of travel 100% cancellation charges are applicable"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                  <span className="text-[#475569] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 text-amber-800 text-sm">
              <strong>Note:</strong> Please read Cancellation and refund policy in our website for more details.
            </div>
          </section>

          <div className="pt-8 border-t border-gray-100 text-center">
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#701C1C] hover:bg-[#5a1616] transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
