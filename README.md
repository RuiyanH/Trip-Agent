# Trip & Experience Planner

A conversational, agentic trip planner that turns vague prompts into a feasible itinerary, can search flights/hotels/places, and (later) books flights & hotels and pushes the full itinerary to your calendar.

### Setup
1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults work for local dev)
   ```

3. **Database setup**
   ```bash
   pnpm migrate
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


### Project Structure
```
trip-agent/
├─ apps/web/                      # Next.js app
│  ├─ app/                        # App Router pages & API
│  ├─ components/                 # React components
│  ├─ lib/                        # Utilities & business logic
│  │  ├─ agent/                   # Agent router & types
│  │  └─ tools/                   # External API adapters
│  ├─ fixtures/                   # Sample data
│  ├─ prisma/                     # Database schema
│  └─ tests/                      # Test files
├─ package.json                   # Root dependencies
└─ pnpm-workspace.yaml           # Monorepo config
```

## Security Notes

- **Session cookies**: httpOnly, secure, sameSite=lax
- **No tokens stored**: Session state only (Day-1)
- **Provider APIs**: Stubbed for Day-1, real auth later

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Node.js runtime
- **Database**: Prisma + SQLite (local dev)
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm (workspaces)
