import { HomeIcon, CalendarIcon, UploadIcon, FileIcon } from "lucide-react"
import Index from "./pages/Index.jsx"
import EventsPage from "./pages/EventsPage.jsx"
import ImportSebPage from "./pages/ImportSebPage.jsx"
import SIE5Page from "./pages/SIE5Page.jsx"

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
  {
    title: "SIE5",
    to: "/sie5",
    icon: <FileIcon className="h-4 w-4" />,
    page: <SIE5Page />,
  },
]