import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { quotes } from "@/data/quotes";
import { RefreshCw } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Home() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const handleNewQuote = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    let nextIndex = Math.floor(Math.random() * quotes.length);
    while (nextIndex === currentQuoteIndex && quotes.length > 1) {
      nextIndex = Math.floor(Math.random() * quotes.length);
    }
    setCurrentQuoteIndex(nextIndex);
  };

  const currentQuote = quotes[currentQuoteIndex] || quotes[0];
  const tweetText = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)/0.03_0%,transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDEiLz4KPHBhdGggZD0iTTAgMEg0VjRIMEowIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] [background-size:24px_24px]" />
        
        {/* Glow behind the quote */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-24 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-8 w-full relative"
            >
              <div className="relative inline-block">
                <span className="absolute -top-10 -left-6 md:-left-12 text-6xl text-primary/20 font-serif font-bold pointer-events-none select-none leading-none">"</span>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-foreground leading-[1.2] md:leading-[1.15] max-w-3xl mx-auto text-balance">
                  {currentQuote.text}
                </h1>
                <span className="absolute -bottom-8 -right-6 md:-right-8 text-6xl text-primary/20 font-serif font-bold pointer-events-none select-none leading-none">"</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 pt-6 md:pt-8">
                <div className="h-[1px] w-8 md:w-12 bg-primary/30" />
                <p className="text-sm md:text-lg text-muted-foreground font-mono uppercase tracking-wider">
                  {currentQuote.author}
                </p>
                <div className="h-[1px] w-8 md:w-12 bg-primary/30" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mx-auto">
          <Button 
            onClick={handleNewQuote}
            disabled={isAnimating}
            className="w-full sm:w-auto min-w-[200px] flex-1 sm:flex-none rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-sm font-mono uppercase tracking-widest border border-primary/50 transition-all duration-300 disabled:opacity-70 group"
          >
            <RefreshCw className={`w-4 h-4 mr-3 ${isAnimating ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
            Next Block
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-14 px-8 rounded-none border-border/50 hover:bg-white/5 hover:text-foreground font-mono text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-sm"
          >
            <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="w-4 h-4 mr-3" />
              Broadcast
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
