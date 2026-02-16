import { TooltipProvider } from '@/components/ui/tooltip';
import { LandingPage } from '@/pages/LandingPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          {/* Add other routes here */}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
