import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Link } from '../types';
import * as storageService from '../services/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data generator for the chart since our simple DB only stores 'total clicks'
  // In a real app, we would query time-series data from the backend.
  const generateMockHistory = (totalClicks: number) => {
    const data = [];
    const days = 7;
    let remaining = totalClicks;
    
    for (let i = 0; i < days; i++) {
        // Distribute roughly
        const val = i === days - 1 ? remaining : Math.floor(Math.random() * (remaining / 2));
        remaining -= val;
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        data.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            clicks: Math.max(0, val)
        });
    }
    return data;
  };
  
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!code) return;
      try {
        const response = await storageService.getLinkByCode(code);
        if (response.status === 200 && response.data) {
          setLink(response.data);
          setChartData(generateMockHistory(response.data.clicks));
        } else {
          setError('Link not found');
        }
      } catch (err) {
        setError('An error occurred while fetching stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || 'Link Not Found'}</h2>
        <RouterLink to="/" className="text-primary-600 hover:underline">Back to Dashboard</RouterLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header / Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <RouterLink to="/" className="hover:text-gray-700">Dashboard</RouterLink>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{link.code}</span>
      </nav>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
           <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-primary-600">/{link.code}</span>
                </h1>
                <a href={link.originalUrl} target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-gray-700 hover:underline truncate max-w-md block mt-1">
                    {link.originalUrl}
                </a>
           </div>
           <a 
             href={`#/${link.code}`}
             target="_blank" 
             rel="noreferrer"
             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
           >
             Visit Link
             <svg className="ml-2 -mr-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
           </a>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Cards */}
            <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Clicks</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{link.clicks}</dd>
            </div>
            <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Last Clicked</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : 'Never'}
                </dd>
            </div>
            <div className="bg-white overflow-hidden rounded-lg border border-gray-200 p-5">
                <dt className="text-sm font-medium text-gray-500 truncate">Created</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(link.createdAt).toLocaleDateString()}
                </dd>
            </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Click Activity (Last 7 Days)</h3>
          <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        allowDecimals={false}
                    />
                    <Tooltip 
                        cursor={{ fill: '#F3F4F6' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.clicks > 0 ? '#0ea5e9' : '#e0f2fe'} />
                        ))}
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center italic">
            * Note: Historical distribution is simulated for this demo.
          </p>
      </div>
    </div>
  );
};

export default StatsPage;