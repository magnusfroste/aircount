import { HomeIcon, CalendarIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import EventsPage from "./pages/EventsPage.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Events",
    to: "/events",
    icon: <CalendarIcon className="h-4 w-4" />,
    page: <EventsPage />,
  },
];
