import { HomeIcon, CalendarIcon, UploadIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import ImportSebPage from "./pages/ImportSebPage.jsx";

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
  {
    title: "Import SEB",
    to: "/import-seb",
    icon: <UploadIcon className="h-4 w-4" />,
    page: <ImportSebPage />,
  },
];