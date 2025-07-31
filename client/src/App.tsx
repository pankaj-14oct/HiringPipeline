import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Jobs from "@/pages/jobs";
import Candidates from "@/pages/candidates";
import Interviews from "@/pages/interviews";
import Assessments from "@/pages/assessments";
import Panels from "@/pages/panels";
import Offers from "@/pages/offers";
import CandidatePortal from "@/pages/candidate-portal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/candidates" component={Candidates} />
      <Route path="/interviews" component={Interviews} />
      <Route path="/assessments" component={Assessments} />
      <Route path="/panels" component={Panels} />
      <Route path="/offers" component={Offers} />
      <Route path="/candidate-portal" component={CandidatePortal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
