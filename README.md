# Aircount 🌬️

Simple accounting app for managing your finances. Track transactions, import data, and generate reports with ease.

## Features

- **Dashboard**: Overview of your financial status
- **Transaction Management**: Track income and expenses
- **Import/Export**: Import CSV and SIE files, export to various formats
- **Account Management**: Manage multiple accounts
- **Reports**: Generate profit & loss statements and balance sheets
- **Responsive Design**: Works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for self-hosting)

### Installation

```bash
npm install
```

### Run Locally

```bash
# Set your Supabase credentials in .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

npm run dev
```

### Self-Hosted Setup

If you want to self-host this application, you'll need:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Set Environment Variables**
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run the Application**
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Supabase** - Backend & Auth
- **shadcn/ui** - Components
- **Tailwind CSS** - Styling
- **OpenAI** - AI features

## License

MIT
