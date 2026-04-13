import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Nithya N",
    location: "Chennai",
    trip: "Chardham Yatra (12 Days)",
    rating: 5,
    comment: "I recently travelled with Pavithra Travels for Chardham tour (12 days) and it was an amazing and pleasant experience!!! Excellent service and well coordination.",
    date: "October 2025"
  },
  {
    id: 2,
    name: "Niveditha Natarajan",
    location: "Tamil Nadu",
    trip: "Chardham Yatra (Group Tour)",
    rating: 5,
    comment: "A group of 18 people went on Chardham yatra in October 2025. The trip and organizing was extraordinary. Yatris should not worry about food, itenaries and time management as tip to toe everything was well planned.",
    date: "October 2025"
  },
  {
    id: 3,
    name: "Krishnamachari Amirtham",
    location: "Verified Reviewer",
    trip: "Chardham Special",
    rating: 5,
    comment: "The tour was well planned and executed. Drivers Surender Singh and Satish did an excellent job taking us to various destinations and bringing us safely to Delhi.",
    date: "October 2025"
  },
  {
    id: 4,
    name: "Vaidy Sarma",
    location: "Chennai",
    trip: "Chardham Divine Experience",
    rating: 5,
    comment: "Excellent stays. Tasty and variety of South Indian Breakfast, Lunch, Dinner. Clear and caring guidance. Journey to Chardham is outstanding. Hearty thanks Mr. Rajasekhar for a wonderful and divine experience.",
    date: "October 2025"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from families who traveled with us
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <Quote className="h-8 w-8 text-amber-200 mb-3" />

              <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                "{testimonial.comment}"
              </p>

              <div className="pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.location}</p>
                <p className="text-xs text-amber-600 mt-1">{testimonial.trip}</p>
                <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8">
          <h3 className="text-xl text-gray-900 mb-2">Join Our Happy Travelers</h3>
          <p className="text-gray-600 mb-4">
            Book your next journey with confidence and create memories that last forever
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            Start Planning Your Trip
          </a>
        </div>
      </div>
    </section>
  );
}
