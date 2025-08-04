# Building Portfolio Copilot: An AI-Powered Investment Thinking Partner

*How I built a web application that challenges investment assumptions and validates macro views using AI*

**Try it live**: [portfoliocopilot.dev](https://portfoliocopilot.dev) | **Source code**: [GitHub](https://github.com/jonyhu/portfolio-copilot)

---

## The Problem: Individual Investors Need Better Decision-Making Tools

As an experienced individual investor, I've always been frustrated by the lack of sophisticated analysis tools available to retail investors. While institutional investors have access to investment committees, research teams, and comprehensive analysis frameworks, individual investors are often left to make decisions in isolation.

The problem isn't just about having access to data, it's about having someone (or something) to challenge your thinking, point out contradictions in your investment thesis, and ask the tough questions that professional investment committees would ask.

## The Vision: A Digital Investment Committee

I wanted to build something that could serve as a "second opinion" for investment decisions—not an advisor that tells you what to do, but a thinking partner that helps you think more deeply about your investment thesis.

The core idea was to create an AI-powered system that could:

1. **Understand your entire portfolio context** - Not just individual stocks, but how everything fits together
2. **Analyze macro and micro views** - Connect your big-picture economic outlook with specific investment choices
3. **Identify contradictions** - Spot inconsistencies between your stated beliefs and actual portfolio allocation
4. **Ask follow-up questions** - Challenge assumptions the way a good investment committee would
5. **Provide conversational insights** - Move beyond static reports to dynamic, interactive analysis

## Technical Challenges and Solutions

### Challenge 1: Client-Side vs Server-Side Architecture

**The Problem**: Initially, I tried to instantiate the OpenAI client directly on the frontend, which led to environment variable issues and security concerns.

**The Solution**: I implemented a proper separation of concerns:
- **Client-side utilities** (`ai-utils.ts`) that handle user interactions and API calls
- **Server-side utilities** (`ai-server.ts`) that handle actual OpenAI API calls
- **Next.js API routes** that provide a secure bridge between the two

This architecture allows users to securely input their own OpenAI API keys while keeping the actual AI processing server-side.

### Challenge 2: Data Persistence Without a Database

**The Problem**: For the MVP, I wanted to avoid the complexity of a database while still providing a smooth user experience where data persists across page navigation.

**The Solution**: I built a robust localStorage-based system with separate utilities for:
- **Portfolio data** (`portfolio-storage.ts`)
- **Macro economic views** (`macro-views-storage.ts`)
- **Chat history** (`chat-storage.ts`)
- **API key management** (`api-key-storage.ts`)

Each utility includes proper SSR safety checks and error handling.

### Challenge 3: AI Response Quality and Conversation Flow

**The Problem**: Early versions produced repetitive, structured responses that felt robotic rather than conversational.

**The Solution**: I implemented different system prompts for different interaction types:
- **Initial analysis**: Structured, comprehensive portfolio review
- **Follow-up questions**: Natural, conversational responses that build on previous context

I also removed complex parsing logic that was truncating responses and implemented proper markdown rendering for better presentation.

## Design Philosophy: Less Advisor, More Copilot

Throughout development, I realized the importance of positioning. The term "advisor" implies giving advice, which puts the AI in a position of authority. Instead, I reframed the application as a "copilot"—a thinking partner that helps you make better decisions without making decisions for you.

This philosophical shift influenced everything from the branding to the conversation design. The AI doesn't tell you what to buy or sell; it helps you think through the implications of your existing beliefs and holdings.

## User Experience Lessons

### 1. Invisible Complexity

The most successful parts of the application are where complex technical implementations feel simple to the user. For example, the portfolio persistence system works seamlessly behind the scenes—users don't need to think about when data is saved or loaded.

### 2. Progressive Enhancement

I built the application to work well for both beginners and experienced investors:
- **Demo data** provides immediate value for exploration
- **Manual portfolio input** serves experienced users who know exactly what they own
- **Future auto-import features** will serve users who want convenience

### 3. Visual Clarity

Initial versions had serious UI issues (white text on white backgrounds, poor contrast). I learned that for a financial application, clarity and readability are non-negotiable. Users need to trust what they're seeing.

## Technical Stack Decisions

### Next.js 15 with App Router
- **Why**: Server-side rendering for performance, API routes for backend logic, excellent deployment story with Vercel
- **Trade-offs**: More complex than a simple React app, but much more powerful

### TailwindCSS
- **Why**: Rapid UI development, consistent design system, excellent dark mode support
- **Trade-offs**: Learning curve, but pays off quickly in development speed

### OpenAI GPT API
- **Why**: Most capable language model for nuanced financial analysis
- **Trade-offs**: Cost and API key management, but user-provided keys solve this

### TypeScript
- **Why**: Essential for a financial application where data integrity matters
- **Trade-offs**: Additional complexity, but prevents entire classes of bugs

## Future Vision

This MVP is just the beginning. Future enhancements I'm considering:

1. **Real-time market data integration** - Live portfolio values and market context
2. **Multi-modal LLM integration** - Auto-import from brokerage screenshots or PDFs
3. **Advanced risk metrics** - Sharpe ratios, beta analysis, correlation matrices
4. **Scenario modeling** - "What if the market drops 20%?" analysis

## Key Takeaways for Other Builders

### 1. Start with the Problem, Not the Technology
I could have built this with any number of tech stacks, but I chose tools that best served the core user need: helping investors think better.

### 2. Embrace Iteration
The application went through multiple major refactors. The parsing logic was completely removed, the AI conversation flow was redesigned, and the positioning was fundamentally changed. Don't be afraid to throw away code that isn't working.

### 3. User Feedback is Everything
Every major improvement came from direct user feedback: "the UI is terrible," "it sounds like it's regurgitating","the text is white on white." Build quickly, get feedback, iterate.

### 4. Focus on the Core Experience
It would have been easy to get distracted by features like user authentication, real-time data, or complex visualizations. Focusing on the core AI conversation experience first was the right choice.

## Conclusion

Building Portfolio Copilot has been an exercise in understanding both the technical challenges of AI integration and the human psychology of investment decision-making. The goal was never to replace human judgment, but to augment it—to provide the kind of rigorous thinking partner that most individual investors lack.

The application represents a new category of financial tools: not robo-advisors that make decisions for you, but AI copilots that help you make better decisions yourself. As AI capabilities continue to improve, I believe this human-AI collaboration model will become increasingly important across many domains, not just investing.

You can try Portfolio Copilot yourself at [portfoliocopilot.dev](https://portfoliocopilot.dev), and the complete source code is available on [GitHub](https://github.com/jonyhu/portfolio-copilot). I'd love to hear your thoughts and experiences using it.

---

*Have you built similar AI-powered tools? What challenges did you face? Share your experiences in the comments below.*

## Technical Details

For developers interested in the implementation details:

- **Tech Stack**: Next.js 15, TypeScript, TailwindCSS, OpenAI API, Recharts
- **Deployment**: Vercel
- **Key Libraries**: react-markdown, rehype-highlight, lucide-react

The application demonstrates patterns for:
- Secure client-side API key management
- localStorage-based persistence with SSR safety
- AI conversation flow design
- Financial data visualization
- Progressive enhancement for different user types