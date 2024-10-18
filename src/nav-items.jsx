import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Package,
  Users,
  Settings,
  FileText,
  BarChart2,
  Calendar,
} from 'lucide-react'

export const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    title: 'Accounts',
    href: '/accounts',
    icon: Users,
  },
  {
    title: 'Templates',
    href: '/templates',
    icon: FileText,
  },
  {
    title: 'Balance Sheet',
    href: '/balance-sheet',
    icon: BarChart2,
  },
  {
    title: 'Profit and Loss',
    href: '/profit-and-loss',
    icon: Receipt,
  },
  {
    title: 'Ledger',
    href: '/ledger',
    icon: Package,
  },
  {
    title: 'Opening Balances',
    href: '/opening-balances',
    icon: CreditCard,
  },
  {
    title: 'Year Management',
    href: '/year-management',
    icon: Calendar,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]