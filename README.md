# Trip & Experience Planner

A conversational, **agentic** trip planner that turns vague prompts into a feasible itinerary, can search flights/hotels/places, and (later) **books** flights & hotels and **pushes** the full itinerary to your calendar.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9.0.0+

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

## 🎯 What Works (Day-1)

- ✅ **Health endpoint**: `/api/health` returns service status
- ✅ **Session management**: Cookie-based sessions with state persistence
- ✅ **Chat API**: `/api/chat` returns **fixture** itinerary (Osaka 3-day)
- ✅ **Database**: Prisma + SQLite with full schema
- ✅ **UI**: Split-pane layout (Chat + Itinerary Preview)
- ✅ **Agent stub**: Returns deterministic fixture data

## 🧪 Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode (if available)
```

## 🏗️ Architecture

```
Agent Router → Tool Stubs → Fixture Data → Itinerary → UI
     ↓              ↓           ↓           ↓       ↓
  Day-1         Day-1       Day-1      Day-1    Day-1
  Stub          Empty       JSON       DB       React
```

## 📅 Next Steps (Day-2)

1. **Google Places Integration**
   - Implement `lib/tools/maps.ts` with real Google Places API
   - Replace fixture with live place search
   - Add distance matrix calculations

2. **Enhanced Agent Logic**
   - Parse user intent from chat messages
   - Generate dynamic itineraries based on constraints
   - Integrate with real tool results

## 🔧 Development

### Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run test suite
- `pnpm migrate` - Run database migrations
- `pnpm format` - Format code with Prettier

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

## 🔒 Security Notes

- **Session cookies**: httpOnly, secure, sameSite=lax
- **No tokens stored**: Session state only (Day-1)
- **Provider APIs**: Stubbed for Day-1, real auth later

## 📚 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Node.js runtime
- **Database**: Prisma + SQLite (local dev)
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm (workspaces)

## 🤝 Contributing

This is a learning project with daily milestones:
- **Day-1**: ✅ Project scaffold + basic UI + fixture data
- **Day-2**: 🔄 Google Places integration
- **Day-3**: 🔄 Hotels search (Expedia Rapid)
- **Day-4**: 🔄 Flights search (Duffel/Amadeus)
- **Day-5**: 🔄 Planner + Critic agents
- **Day-6**: 🔄 Booking flows + Calendar push
- **Day-7**: 🔄 Polish + demo data

## 📄 License

MIT License - see LICENSE file for details
