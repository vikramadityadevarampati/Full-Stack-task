import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link as RouterLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StatsPage from './components/StatsPage';
import HealthCheck from './components/HealthCheck';
import RedirectHandler from './components/RedirectHandler';
import { Layout } from './components/Layout';

// 404 Component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
    <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
    <RouterLink to="/" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
      Return Home
    </RouterLink>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/code/:code" element={<Layout><StatsPage /></Layout>} />
        <Route path="/healthz" element={<HealthCheck />} />
        
        {/* Redirect Route - Matches any top-level path that isn't defined above.
            Note: In a real Express app, this would be /:code. 
            In React Router, we put it last to catch-all, or be specific if possible. 
            Since /healthz is explicit, :code will catch everything else.
        */}
        <Route path="/:code" element={<RedirectHandler />} />
        
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </HashRouter>
  );
};

export default App;