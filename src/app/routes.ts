import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { TempleDestinations } from "./pages/temple-destinations";
import { TempleDetail } from "./pages/temple-detail";
import { FamilyTrips } from "./pages/family-trips";
import { AllDestinations } from "./pages/all-destinations";
import { DestinationDetail } from "./pages/destination-detail";
import { Booking } from "./pages/booking";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/temples",
    Component: TempleDestinations,
  },
  {
    path: "/temples/:templeId",
    Component: TempleDetail,
  },
  {
    path: "/family-trips",
    Component: FamilyTrips,
  },
  {
    path: "/destinations",
    Component: AllDestinations,
  },
  {
    path: "/destinations/:destinationId",
    Component: DestinationDetail,
  },
  {
    path: "/booking",
    Component: Booking,
  },
]);