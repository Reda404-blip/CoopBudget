# Setup Guide

This guide will help you set up CoopBudget for development and production deployment.

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- A Supabase account
- An OpenAI API key (for AI features)

### 1. Clone and Install

```bash
git clone https://github.com/your-username/coopbudget.git
cd coopbudget
npm install
```

### 2. Environment Configuration

Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Run the database migrations:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

### 4. Database Seeding

Seed the database with initial data:

```bash
npm run dev
# Then visit http://localhost:3000/admin to access the seed database page
```

### 5. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |

## Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**
   - Ensure all dependencies are installed: `npm install`
   - Check TypeScript configuration in `tsconfig.json`

2. **Database connection issues**
   - Verify Supabase credentials in `.env.local`
   - Check if Supabase project is active
   - Run migrations: `supabase db push`

3. **OpenAI API errors**
   - Verify `OPENAI_API_KEY` is correct
   - Check API quota and billing status

### Getting Help

- Check the [README.md](../README.md) for general information
- Review [GitHub Issues](https://github.com/your-username/coopbudget/issues) for known problems
- Create a new issue if you encounter a bug
