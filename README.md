# CoopBudget

A comprehensive budget management platform designed for cooperatives. This application provides tools for cost tracking, analytical accounting, budget creation, variance analysis, and financial reporting.

## Features

- **Cost Tracking**: Monitor and analyze cooperative costs
- **Analytical Accounting**: Manage analytical accounting with ease
- **Budget Management**: Create and track budget forecasts
- **Variance Analysis**: Analyze differences between forecasts and actuals
- **Budget Analysis**: Perform advanced budget analyses
- **Financial Exercises**: Solve budget management exercises

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks
- **Deployment**: Vercel/Netlify ready

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account
- OpenAI API key (for AI features)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/coopbudget.git
   cd coopbudget
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

4. **Database Setup**
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/`
   - Update your environment variables with the Supabase credentials

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
coopbudget/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and configurations
│   ├── services/           # API service functions
│   └── types/              # TypeScript type definitions
├── assets/                 # Static assets (images, icons, etc.)
├── docs/                   # Documentation
├── tests/                  # Test files
├── supabase/               # Database schema and migrations
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── LICENSE                # MIT License
├── next.config.mjs        # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses Supabase with the following main tables:
- `analyses` - Budget analyses and reports
- `budgets` - Budget definitions and tracking
- `exercises` - Financial exercises and scenarios
- `products` - Product catalog
- `accounting_entries` - Accounting journal entries

## API Routes

- `/api/analyses` - Analysis operations
- `/api/budgets` - Budget management
- `/api/products` - Product management
- `/api/seed` - Database seeding
- `/api/ai-analysis` - AI-powered analysis

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@coopbudget.com or join our Discord community.

## Roadmap

- [ ] Mobile app
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Integration with accounting software
- [ ] Real-time collaboration
