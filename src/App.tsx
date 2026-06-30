import { lazy, Suspense } from "react";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Diamonds from "@/pages/Diamonds";
import Jewellery from "@/pages/Jewellery";
import Trade from "@/pages/Trade";
import Investment from "@/pages/Investment";
import Journal from "@/pages/Journal";
import ArticleDetail from "@/pages/ArticleDetail";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Services from "@/pages/Services";
import FAQ from "@/pages/FAQ";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Shortlist from "@/pages/Shortlist";
import Login from "@/pages/Login";
import QuoteRequest from "@/pages/QuoteRequest";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShortlistProvider } from "@/contexts/ShortlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";

const StudioPage = lazy(() => import("@/pages/Studio"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/studio">
        <Suspense fallback={<div style={{ background: "#02274A", minHeight: "100vh" }} />}>
          <StudioPage />
        </Suspense>
      </Route>
      <Route path="/studio/*">
        <Suspense fallback={<div style={{ background: "#02274A", minHeight: "100vh" }} />}>
          <StudioPage />
        </Suspense>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/diamonds" component={Diamonds} />
            <Route path="/jewellery" component={Jewellery} />
            <Route path="/trade" component={Trade} />
            <Route path="/investment" component={Investment} />
            <Route path="/services" component={Services} />
            <Route path="/faq" component={FAQ} />
            <Route path="/about" component={About} />
            <Route path="/journal" component={Journal} />
            <Route path="/journal/:slug" component={ArticleDetail} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/shortlist" component={Shortlist} />
            <Route path="/login" component={Login} />
            <Route path="/quote-request" component={QuoteRequest} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ShortlistProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </AuthProvider>
        </ShortlistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
