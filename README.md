# Portfolio Copilot

Your investment thinking partner. Think deeper about your investment thesis with AI-powered portfolio analysis that challenges your assumptions and validates your macro views.

**🚀 [Try it live](https://portfoliocopilot.dev)** | **📖 [Read the blog post](link-to-blog)**

## Features

### Core Functionality
- **Portfolio Management**: Add, edit, and delete assets (stocks, ETFs, bonds, crypto)
- **Investment Thinking Partner**: AI-powered analysis that challenges your assumptions
- **Thesis Validation**: Evaluate if your portfolio aligns with your macro views
- **Conversational Analysis**: Dynamic AI chat that builds on previous conversations
- **Visual Insights**: Interactive charts and portfolio analytics
- **Data Persistence**: Client-side storage with no account required
- **Privacy-First**: Your data stays on your device except during AI analysis

### Technical Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, and TailwindCSS
- **Charts**: Recharts for interactive data visualization
- **AI Integration**: OpenAI GPT API with server-side key and rate limiting
- **Markdown**: Enhanced response formatting with syntax highlighting
- **Icons**: Lucide React
- **Deployment**: Vercel with serverless API routes

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for local dev or self-hosting)

### Quick Start

**Option 1: Use the hosted version (recommended)**
1. Visit [portfoliocopilot.dev](https://portfoliocopilot.dev)
2. Start analyzing your portfolio immediately

**Option 2: Run locally**
1. Clone the repository:
```bash
git clone https://github.com/jonyhu/portfolio-copilot.git
cd portfolio-copilot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (see `.env.example`):
```bash
OPENAI_API_KEY=sk-your-key-here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Key Setup
This application uses a server-side OpenAI API key:
- Set `OPENAI_API_KEY` in `.env.local` (local dev) or your hosting provider
- Keys are never exposed to the browser
- You can get an OpenAI API key at [platform.openai.com](https://platform.openai.com/api-keys)

### Cost Controls
Usage limits are configurable via environment variables (see `.env.example`):
- `AI_RATE_LIMIT_PER_MINUTE` and `AI_RATE_LIMIT_PER_DAY` for request caps
- `AI_MAX_ASSETS`, `AI_MAX_BODY_CHARS`, and `AI_MAX_MACRO_CHARS` for input limits
- `OPENAI_MAX_TOKENS_*` to control response length
- `OPENAI_MODEL` to choose a cost/quality tradeoff

## Usage

### Getting Started
1. **Load Demo Data** (optional): Click "Load Demo Data" to explore with sample portfolio
2. **Build Your Portfolio**: Add your actual holdings or start with demo data
3. **AI Analysis**: Navigate to Analysis and share your macro views

### Portfolio Management
1. **Add Assets**: Click "Add Asset" in the Portfolio tab
2. **Asset Types**: Supports stocks, ETFs, bonds, crypto, and other investments
3. **Required Fields**: Ticker, Asset Name, Type, Quantity, Purchase Price
4. **Optional Fields**: Current price, purchase date, notes
5. **Edit/Delete**: Click on any asset to modify or remove

### AI Analysis Workflow
1. **Analysis Tab**: Navigate to the AI analysis interface
2. **Macro Views**: Describe your investment thesis:
   - Economic growth outlook
   - Interest rate expectations  
   - Government policy impacts
   - Geopolitical considerations
   - Industry-specific views
3. **Initial Analysis**: Get comprehensive portfolio review and contradictions
4. **Follow-up Chat**: Ask questions and dive deeper into specific insights
5. **Persistent Conversations**: Your chat history is saved across sessions

### Visualization & Data
- **Charts Tab**: Interactive portfolio allocation charts and performance metrics
- **Export/Import**: Backup your portfolio data via Settings
- **Multiple Views**: Pie charts, allocation tables, and gain/loss analysis

## Development

### Project Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Portfolio management page
│   ├── analysis/          # AI chat interface
│   ├── charts/            # Data visualization page
│   ├── settings/          # Configuration and data management
│   └── api/               # Serverless API routes
│       ├── analyze/       # Portfolio analysis endpoint
│       └── follow-up-questions/  # Chat continuation endpoint
├── components/             # React components
│   ├── Layout.tsx         # Main app layout and navigation
│   ├── AssetForm.tsx      # Add/edit asset modal
│   ├── PortfolioChart.tsx # Interactive pie charts
│   └── MarkdownRenderer.tsx  # AI response formatting
├── lib/                   # Utility functions and storage
│   ├── ai-utils.ts        # Client-side AI API wrapper
│   ├── ai-server.ts       # Server-side OpenAI integration
│   ├── portfolio-utils.ts # Portfolio calculations
│   ├── *-storage.ts       # LocalStorage management utilities
│   └── demo-data.ts       # Sample data for exploration
└── types/                 # TypeScript definitions
    └── portfolio.ts       # Core data types
```

### Key Components & Architecture
- **Client-Side Storage**: All data persisted in browser localStorage
- **API Routes**: Next.js serverless functions for OpenAI integration  
- **Component Isolation**: Each page is self-contained with proper state management
- **Type Safety**: Comprehensive TypeScript coverage
- **Responsive Design**: TailwindCSS with mobile-first approach

## Deployment

### Vercel (Recommended)
The app is optimized for Vercel deployment with minimal configuration:

1. **Fork this repository** on GitHub
2. **Connect to Vercel**: Import your fork at [vercel.com](https://vercel.com)
3. **Deploy**: Set `OPENAI_API_KEY` as an environment variable
4. **Custom Domain** (optional): Add your domain in Vercel dashboard

### Other Platforms
- **Netlify**: Works with standard Next.js build settings
- **Railway/Render**: Compatible with Node.js hosting
- **Self-hosted**: Use `npm run build && npm start`

### Build Configuration
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: 18+

## Architecture Decisions

### Why Server-Side API Keys?
- **Low Friction**: Users can try the product without setup
- **Cost Controls**: Centralized rate limiting and input caps
- **Security**: Keys never reach the browser
- **Operational Simplicity**: One configuration for deployment

### Why localStorage?
- **No Database Required**: Reduces complexity and hosting costs
- **Instant Startup**: No account creation or login friction
- **Privacy**: Data stored locally; only sent during AI analysis
- **Offline Capable**: Portfolio data available without internet

## Future Enhancements

### Planned Features
- **Real-time Market Data**: Live portfolio values via Yahoo Finance/Alpha Vantage
- **Advanced Risk Metrics**: Sharpe ratio, beta, correlation analysis
- **Auto-Import**: Multimodal LLM for parsing brokerage statements
- **Scenario Modeling**: "What if" analysis for market conditions
- **Export Formats**: PDF reports, CSV exports

### Community Ideas
- **Chat Persistence**: Cross-tab chat history (in development)
- **Portfolio Sharing**: Anonymous portfolio insights
- **Template Strategies**: Predefined portfolio allocations
- **API Integration**: Plaid for automated syncing

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. **Fork and Clone**: Fork the repo and clone your fork
2. **Install Dependencies**: `npm install`
3. **Run Development Server**: `npm run dev`
4. **Set API Key**: Add `OPENAI_API_KEY` to `.env.local` for testing

### Contribution Guidelines
- **Issues First**: Open an issue to discuss major changes
- **TypeScript**: Maintain type safety across all new code
- **Testing**: Test your changes with both demo and real data
- **UI/UX**: Ensure responsive design and accessibility
- **Documentation**: Update README for new features

### Pull Request Process
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with proper TypeScript types
3. Test thoroughly with demo data
4. Submit PR with clear description of changes

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the investing community. Happy analyzing! 📈**
