# Portfolio Advisor Web App

A comprehensive portfolio analysis and advisory tool designed for experienced individual investors to evaluate their portfolio through the lens of macro-economic views and investment committee-style analysis.

## Features

### Core Functionality
- **Portfolio Management**: Add, edit, and delete assets (stocks, ETFs, bonds)
- **AI-Powered Analysis**: Interactive chat interface using OpenAI GPT for portfolio insights
- **Macro View Integration**: Evaluate portfolio impact based on economic growth, interest rates, government policy, and geopolitics
- **Investment Committee Simulation**: AI challenges your investment thesis and asks follow-up questions
- **Visual Analytics**: Pie charts and allocation breakdowns

### Technical Stack
- **Frontend**: Next.js 14 with TypeScript and TailwindCSS
- **Charts**: Recharts for data visualization
- **AI Integration**: OpenAI GPT API
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-analysis
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Assets
1. Navigate to the Portfolio tab
2. Click "Add Asset" 
3. Fill in: Ticker, Asset Name, Type, Quantity, Purchase Price
4. Save to add to your portfolio

### AI Analysis
1. Go to the Analysis tab
2. Describe your macro views on:
   - Economic growth outlook
   - Interest rate expectations
   - Government policy impacts
   - Geopolitical considerations
3. The AI will analyze your portfolio through this lens and provide insights

### Portfolio Insights
- View allocation breakdown by asset type
- See total portfolio value and performance
- Get diversification recommendations

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
├── lib/                # Utility functions
├── types/              # TypeScript definitions
└── hooks/              # Custom React hooks
```

### Key Components
- `PortfolioManager`: Asset management interface
- `ChatInterface`: AI analysis chat
- `PortfolioChart`: Visualization components
- `AssetForm`: Add/edit asset forms

## Deployment

The app is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## Future Enhancements

- Real-time market data integration
- Risk metrics (Sharpe ratio, beta)
- Automated portfolio syncing via Plaid
- MCP server for modular tool orchestration
- Scenario simulation tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
