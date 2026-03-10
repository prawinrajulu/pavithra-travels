import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import {
  destinations,
  isOperatingHours,
  isSunday,
  type Destination,
} from "../data/chatbot-data";

type MessageType = "bot" | "user";
type ChatStep =
  | "greeting"
  | "main-menu"
  | "explore-destinations"
  | "ai-suggestion"
  | "category-select"
  | "destination-list"
  | "destination-details"
  | "booking-wizard"
  | "check-status"
  | "talk-expert"
  | "success";

type BookingStep =
  | "date"
  | "persons"
  | "name"
  | "email"
  | "phone"
  | "confirm";

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface BookingData {
  destination: Destination | null;
  travelDate: string;
  numberOfPersons: string;
  name: string;
  email: string;
  phone: string;
  bookingId?: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] =
    useState<ChatStep>("greeting");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("");
  const [filteredDestinations, setFilteredDestinations] =
    useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    destination: null,
    travelDate: "",
    numberOfPersons: "",
    name: "",
    email: "",
    phone: "",
  });
  const [currentBookingStep, setCurrentBookingStep] =
    useState<BookingStep>("date");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownGreeting, setHasShownGreeting] =
    useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !hasShownGreeting) {
      const timer = setTimeout(() => {
        showGreeting();
        setHasShownGreeting(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasShownGreeting]);

  const addMessage = (
    content: string,
    type: MessageType,
    delay = 0,
  ) => {
    if (delay > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const newMessage: Message = {
          id: Date.now().toString() + Math.random(),
          type,
          content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }, delay);
    } else {
      const newMessage: Message = {
        id: Date.now().toString() + Math.random(),
        type,
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
    }
  };

  const showGreeting = () => {
    const sundayMsg = isSunday();
    const operatingMsg = !isOperatingHours() && !sundayMsg;

    let greeting =
      "Welcome to Pavithra Travels 🌏\n\nExplore India with Comfort and Care.\n\n";

    if (sundayMsg) {
      greeting +=
        "⚠️ We are closed on Sundays.\nBookings will resume Monday.\n\n";
    } else if (operatingMsg) {
      greeting +=
        "⏰ Outside operating hours.\nOur team will respond during:\nMon–Sat (10 AM – 9 PM)\n\n";
    }

    greeting += "How can we assist you today?";

    addMessage(greeting, "bot", 500);
    setCurrentStep("main-menu");
  };

  const handleMainMenuOption = (option: string) => {
    addMessage(option, "user");

    if (option === "Explore Destinations") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Wonderful! Let's explore amazing destinations across India.\n\nSelect a category:",
          "bot",
        );
        setCurrentStep("category-select");
      }, 600);
    } else if (option === "Get Package Suggestion") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          'I\'d love to help you find the perfect trip! 🎯\n\nTell me what you\'re looking for:\n\nExamples:\n• "3 days temple tour in South India"\n• "Family trip to hill station"\n• "Beach vacation for 5 days"\n\nType your preference:',
          "bot",
        );
        setCurrentStep("ai-suggestion");
      }, 600);
    } else if (option === "Check Booking Status") {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Please enter your Booking ID:\n\n(Format: PT followed by 6 digits)\nExample: PT123456",
          "bot",
        );
        setCurrentStep("check-status");
      }, 600);
    } else if (option === "Talk to Travel Expert") {
      handleTalkToExpert();
    }
  };

  const handleCategorySelect = (category: string) => {
    addMessage(category, "user");
    setSelectedCategory(category.toLowerCase());

    let filtered: Destination[] = [];

    if (category === "Temple Tours") {
      filtered = destinations.filter(
        (d) => d.category === "temple",
      );
    } else if (category === "Family Vacations") {
      filtered = destinations.filter(
        (d) =>
          d.category === "family" ||
          d.category === "beach" ||
          d.category === "hill-station",
      );
    } else if (category === "Adventure Trips") {
      filtered = destinations.filter(
        (d) => d.category === "adventure",
      );
    } else if (category === "All Destinations") {
      filtered = destinations;
    }

    setFilteredDestinations(filtered);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(
        `Here are our ${category.toLowerCase()}:\n\nSelect a destination to learn more:`,
        "bot",
      );
      setCurrentStep("destination-list");
    }, 600);
  };

  const handleAISuggestion = (query: string) => {
    if (!query.trim()) return;

    addMessage(query, "user");
    setInputValue("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      // Simple AI matching logic
      const lowerQuery = query.toLowerCase();
      let matched: Destination[] = [];

      // Extract duration
      const durationMatch = lowerQuery.match(/(\d+)\s*days?/);
      const duration = durationMatch
        ? parseInt(durationMatch[1])
        : null;

      // Extract category
      const isTemple =
        /temple|pilgrimage|religious|spiritual/i.test(
          lowerQuery,
        );
      const isBeach = /beach|sea|coast/i.test(lowerQuery);
      const isHill = /hill|mountain|snow/i.test(lowerQuery);
      const isFamily = /family|kids|children/i.test(lowerQuery);

      // Extract region
      const isNorth = /north/i.test(lowerQuery);
      const isSouth = /south/i.test(lowerQuery);
      const isEast = /east/i.test(lowerQuery);
      const isWest = /west/i.test(lowerQuery);

      matched = destinations
        .filter((d) => {
          let score = 0;

          // Duration matching
          if (
            duration &&
            Math.abs(d.durationDays - duration) <= 1
          )
            score += 3;

          // Category matching
          if (isTemple && d.category === "temple") score += 3;
          if (isBeach && d.category === "beach") score += 3;
          if (isHill && d.category === "hill-station")
            score += 3;
          if (
            isFamily &&
            (d.category === "family" || d.category === "beach")
          )
            score += 2;

          // Region matching
          if (isNorth && d.region === "north") score += 2;
          if (isSouth && d.region === "south") score += 2;
          if (isEast && d.region === "east") score += 2;
          if (isWest && d.region === "west") score += 2;

          return score > 0;
        })
        .sort((a, b) => {
          // Sort by relevance (you can add scoring logic here)
          return 0;
        });

      if (matched.length > 0) {
        setFilteredDestinations(matched.slice(0, 5));
        addMessage(
          `Great! Based on your preferences, I found ${matched.length} matching destination${matched.length > 1 ? "s" : ""}:\n\nSelect one to view details:`,
          "bot",
        );
        setCurrentStep("destination-list");
      } else {
        addMessage(
          "I couldn't find exact matches, but here are our popular destinations:\n\nSelect one to explore:",
          "bot",
        );
        setFilteredDestinations(destinations.slice(0, 6));
        setCurrentStep("destination-list");
      }
    }, 1000);
  };

  const handleDestinationSelect = (
    destination: Destination,
  ) => {
    addMessage(destination.name, "user");
    setSelectedDestination(destination);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const details = `📍 ${destination.name}, ${destination.state}\n\n${destination.description}\n\n⏱️ Duration: ${destination.duration}\n💰 Budget: ${destination.budget}\n🌤️ Best Season: ${destination.bestSeason}\n\n✨ Highlights:\n${destination.highlights.map((h) => `• ${h}`).join("\n")}`;
      addMessage(details, "bot");
      setCurrentStep("destination-details");
    }, 700);
  };

  const handleBookNow = () => {
    if (isSunday()) {
      addMessage("Book This Trip", "user");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "We are closed on Sundays. Please contact us on Monday to complete your booking. Our team will be happy to assist you!",
          "bot",
        );
      }, 600);
      return;
    }

    addMessage("Book This Trip", "user");
    setBookingData({
      ...bookingData,
      destination: selectedDestination,
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(
        "Excellent choice! Let's complete your booking.\n\n📅 When would you like to travel?\n\nPlease enter your preferred date (DD/MM/YYYY):",
        "bot",
      );
      setCurrentStep("booking-wizard");
      setCurrentBookingStep("date");
    }, 600);
  };

  const handleBookingWizardInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    addMessage(value, "user");

    if (currentBookingStep === "date") {
      setBookingData((prev) => ({
        ...prev,
        travelDate: value,
      }));
      setInputValue("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Great! 👥\n\nHow many persons will be traveling?\n\n(Enter number of travelers):",
          "bot",
        );
        setCurrentBookingStep("persons");
      }, 600);
    } else if (currentBookingStep === "persons") {
      if (!/^\d+$/.test(value) || parseInt(value) < 1) {
        setInputValue("");
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            "Please enter a valid number of persons:",
            "bot",
          );
        }, 500);
        return;
      }
      setBookingData((prev) => ({
        ...prev,
        numberOfPersons: value,
      }));
      setInputValue("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Perfect! 👤\n\nPlease enter your full name:",
          "bot",
        );
        setCurrentBookingStep("name");
      }, 600);
    } else if (currentBookingStep === "name") {
      setBookingData((prev) => ({ ...prev, name: value }));
      setInputValue("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Thank you! �\n\nPlease enter your email address:",
          "bot",
        );
        setCurrentBookingStep("email");
      }, 600);
    } else if (currentBookingStep === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setInputValue("");
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            "Please enter a valid email address:",
            "bot",
          );
        }, 500);
        return;
      }
      setBookingData((prev) => ({ ...prev, email: value }));
      setInputValue("");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage(
          "Great! �📱\n\nPlease enter your phone number (10 digits):",
          "bot",
        );
        setCurrentBookingStep("phone");
      }, 600);
    } else if (currentBookingStep === "phone") {
      if (!/^\d{10}$/.test(value)) {
        setInputValue("");
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(
            "Please enter a valid 10-digit phone number:",
            "bot",
          );
        }, 500);
        return;
      }
      setBookingData((prev) => ({ ...prev, phone: value }));
      setInputValue("");
      showBookingSummary({ ...bookingData, phone: value });
    }
  };

  const showBookingSummary = (data: BookingData) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const summary = `📋 Booking Summary:\n\n🎯 Destination: ${data.destination?.name}\n📅 Travel Date: ${data.travelDate}\n👥 Persons: ${data.numberOfPersons}\n👤 Name: ${data.name}\n� Email: ${data.email}\n�📱 Phone: ${data.phone}\n💰 Est. Cost: ${data.destination?.budget}\n\nPlease confirm your booking:`;
      addMessage(summary, "bot");
      setCurrentBookingStep("confirm");
    }, 700);
  };

  const confirmBooking = () => {
    addMessage("Confirm Booking", "user");

    // Generate unique booking ID
    const bookingId = "PT" + Date.now().toString().slice(-6);
    const finalBookingData = { ...bookingData, bookingId };

    // Save to localStorage (mock database)
    const existingBookings = JSON.parse(
      localStorage.getItem("pavithra_bookings") || "[]",
    );
    existingBookings.push({
      ...finalBookingData,
      createdAt: new Date().toISOString(),
      status: "Pending",
    });
    localStorage.setItem(
      "pavithra_bookings",
      JSON.stringify(existingBookings),
    );

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      // Generate WhatsApp message
      const whatsappMessage = `Hi Pavithra Travels! I've booked a trip to ${bookingData.destination?.name}. Booking ID: ${bookingId}. Name: ${bookingData.name}, Email: ${bookingData.email}, Phone: ${bookingData.phone}, Date: ${bookingData.travelDate}, Persons: ${bookingData.numberOfPersons}`;
      const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`;

      const successMessage = `✅ Booking Confirmed!\n\nBooking ID: ${bookingId}\n\nThank you for choosing Pavithra Travels!\n\nOur team will contact you shortly to confirm the details and finalize your itinerary.\n\n📞 Call: +91 98765 43210\n💬 WhatsApp: Click below to chat\n\nOperating Hours:\nMon–Sat: 10 AM – 9 PM`;

      addMessage(successMessage, "bot");
      setCurrentStep("success");

      // Store WhatsApp URL for button
      (window as any).currentWhatsAppUrl = whatsappUrl;
    }, 1000);
  };

  const handleCheckStatus = (bookingId: string) => {
    if (!bookingId.trim()) return;

    addMessage(bookingId, "user");
    setInputValue("");

    const bookings = JSON.parse(
      localStorage.getItem("pavithra_bookings") || "[]",
    );
    const booking = bookings.find(
      (b: any) => b.bookingId === bookingId.toUpperCase(),
    );

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (booking) {
        const statusMsg = `✅ Booking Found!\n\nBooking ID: ${booking.bookingId}\nDestination: ${booking.destination?.name}\nStatus: ${booking.status}\nTravel Date: ${booking.travelDate}\nPersons: ${booking.numberOfPersons}\n\nFor updates, call: +91 98765 43210`;
        addMessage(statusMsg, "bot");
      } else {
        addMessage(
          "❌ Booking not found.\n\nPlease check your Booking ID or contact us:\n📞 +91 98765 43210",
          "bot",
        );
      }
      setCurrentStep("main-menu");
    }, 800);
  };

  const handleTalkToExpert = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(
        "📞 Connect with our Travel Experts:\n\nPhone: +91 98765 43210\nEmail: info@pavithratravels.com\n\nOperating Hours:\nMon–Sat: 10 AM – 9 PM\nSunday: Closed\n\nOur team is ready to help plan your perfect journey!",
        "bot",
      );
    }, 600);
  };

  const handleBack = () => {
    if (currentStep === "category-select") {
      setCurrentStep("main-menu");
    } else if (currentStep === "destination-list") {
      setCurrentStep("category-select");
      setFilteredDestinations([]);
    } else if (currentStep === "destination-details") {
      setCurrentStep("destination-list");
      setSelectedDestination(null);
    } else if (currentStep === "booking-wizard") {
      if (currentBookingStep === "date") {
        setCurrentStep("destination-details");
      } else {
        // Go back one step in booking wizard
        const steps: BookingStep[] = [
          "date",
          "persons",
          "name",
          "email",
          "phone",
          "confirm",
        ];
        const currentIndex = steps.indexOf(currentBookingStep);
        if (currentIndex > 0) {
          setCurrentBookingStep(steps[currentIndex - 1]);
        }
      }
    }
  };

  const handleReset = () => {
    setCurrentStep("greeting");
    setSelectedCategory("");
    setFilteredDestinations([]);
    setSelectedDestination(null);
    setBookingData({
      destination: null,
      travelDate: "",
      numberOfPersons: "",
      name: "",
      email: "",
      phone: "",
    });
    setCurrentBookingStep("date");
    setInputValue("");
    setMessages([]);
    showGreeting();
  };

  const openWhatsApp = () => {
    const url = (window as any).currentWhatsAppUrl;
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all hover:scale-110 animate-pulse"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[650px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStep !== "greeting" &&
                currentStep !== "main-menu" &&
                currentStep !== "success" && (
                  <button
                    onClick={handleBack}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
              <div>
                <h3 className="font-semibold">
                  Pavithra Travels
                </h3>
                <p className="text-xs text-white/90">
                  AI Travel Assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <div
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {currentStep === "main-menu" && !isTyping && (
              <div className="space-y-2">
                <button
                  onClick={() =>
                    handleMainMenuOption("Explore Destinations")
                  }
                  className="w-full bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-200 hover:border-amber-300 rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md"
                >
                  <p className="font-medium text-sm text-gray-900">
                    🗺️ Explore Destinations
                  </p>
                </button>
                <button
                  onClick={() =>
                    handleMainMenuOption(
                      "Get Package Suggestion",
                    )
                  }
                  className="w-full bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-200 hover:border-amber-300 rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md"
                >
                  <p className="font-medium text-sm text-gray-900">
                    🎯 Get Package Suggestion
                  </p>
                </button>
                <button
                  onClick={() =>
                    handleMainMenuOption("Check Booking Status")
                  }
                  className="w-full bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-200 hover:border-amber-300 rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md"
                >
                  <p className="font-medium text-sm text-gray-900">
                    📋 Check Booking Status
                  </p>
                </button>
                <button
                  onClick={() =>
                    handleMainMenuOption(
                      "Talk to Travel Expert",
                    )
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-3 text-sm transition-all shadow-md hover:shadow-lg"
                >
                  💬 Talk to Travel Expert
                </button>
              </div>
            )}

            {currentStep === "category-select" && !isTyping && (
              <div className="space-y-2">
                {[
                  "Temple Tours",
                  "Family Vacations",
                  "Adventure Trips",
                  "All Destinations",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() =>
                      handleCategorySelect(category)
                    }
                    className="w-full bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-200 hover:border-amber-300 rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md"
                  >
                    <p className="font-medium text-sm text-gray-900">
                      {category}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {currentStep === "destination-list" &&
              !isTyping && (
                <div className="space-y-2">
                  {filteredDestinations.map((destination) => (
                    <button
                      key={destination.id}
                      onClick={() =>
                        handleDestinationSelect(destination)
                      }
                      className="w-full bg-white hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border border-gray-200 hover:border-amber-300 rounded-xl p-3 text-left transition-all shadow-sm hover:shadow-md"
                    >
                      <p className="font-semibold text-sm text-gray-900">
                        {destination.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {destination.duration} •{" "}
                        {destination.budget}
                      </p>
                    </button>
                  ))}
                </div>
              )}

            {currentStep === "destination-details" &&
              !isTyping && (
                <div className="space-y-2">
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl p-4 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    ✅ Book This Trip
                  </button>
                  <button
                    onClick={handleTalkToExpert}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm transition-all shadow-sm"
                  >
                    💬 Talk to Expert
                  </button>
                </div>
              )}

            {currentStep === "booking-wizard" &&
              currentBookingStep === "confirm" &&
              !isTyping && (
                <div className="space-y-2">
                  <button
                    onClick={confirmBooking}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl p-4 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    ✅ Confirm Booking
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm transition-all shadow-sm"
                  >
                    ← Edit Details
                  </button>
                </div>
              )}

            {currentStep === "success" && !isTyping && (
              <div className="space-y-2">
                <button
                  onClick={openWhatsApp}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl p-4 text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  💬 Chat on WhatsApp
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl p-3 text-sm transition-all shadow-md"
                >
                  🔄 New Booking
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm transition-all shadow-sm"
                >
                  Close Chat
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          {(currentStep === "ai-suggestion" ||
            currentStep === "check-status" ||
            (currentStep === "booking-wizard" &&
              currentBookingStep !== "confirm")) && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === "ai-suggestion") {
                  handleAISuggestion(inputValue);
                } else if (currentStep === "check-status") {
                  handleCheckStatus(inputValue);
                } else if (currentStep === "booking-wizard") {
                  handleBookingWizardInput(e);
                }
              }}
              className="p-4 bg-white border-t border-gray-200"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(e.target.value)
                  }
                  placeholder={
                    currentStep === "ai-suggestion"
                      ? "Describe your ideal trip..."
                      : currentStep === "check-status"
                        ? "Enter Booking ID"
                        : currentBookingStep === "date"
                          ? "DD/MM/YYYY"
                          : currentBookingStep === "persons"
                            ? "Number of persons"
                            : currentBookingStep === "name"
                              ? "Your name"
                              : "Phone number"
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                  disabled={isTyping}
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}