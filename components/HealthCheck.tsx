import React, { useEffect, useState } from 'react';
import { HealthStatus } from '../types';

// Since this is a Client Side App, we mock the system health.
const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<HealthStatus | null>(null);

  useEffect(() => {
    // Simulate check
    setStatus({
      ok: true,
      version: "1.0.0",
      uptime: performance.now() / 1000, // Browser-compatible uptime (seconds since page load)
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="p-8 font-mono bg-gray-900 text-green-400 min-h-screen whitespace-pre">
      {status ? JSON.stringify(status, null, 2) : 'Checking...'}
    </div>
  );
};

export default HealthCheck;