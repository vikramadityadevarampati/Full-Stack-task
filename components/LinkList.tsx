import React, { useState } from 'react';
import { Link as LinkType } from '../types';
import { Link as RouterLink } from 'react-router-dom';

interface LinkListProps {
  links: LinkType[];
  onDelete: (code: string) => void;
}

export const LinkList: React.FC<LinkListProps> = ({ links, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(filter.toLowerCase()) ||
      link.originalUrl.toLowerCase().includes(filter.toLowerCase())
  );

  const copyToClipboard = (code: string) => {
    const fullUrl = `${window.location.origin}/#/${code}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (links.length === 0) {
    return (
      <div className="p-12 text-center bg-gray-50">
        <p className="text-gray-500">No links created yet. Create your first one above!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Search by code or URL"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile View (Cards) */}
      <div className="block sm:hidden">
        {filteredLinks.map((link) => (
          <div key={link.code} className="p-4 border-b border-gray-200 hover:bg-gray-50">
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <RouterLink to={`/code/${link.code}`} className="text-primary-600 font-bold hover:underline">
                         /{link.code}
                    </RouterLink>
                    <button
                        onClick={() => copyToClipboard(link.code)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        {copiedCode === link.code ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                        )}
                    </button>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {link.clicks} clicks
                </span>
             </div>
             <p className="text-sm text-gray-500 truncate mb-3">{link.originalUrl}</p>
             <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{new Date(link.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => { if(window.confirm('Are you sure?')) onDelete(link.code); }}
                  className="text-red-600 text-xs font-medium hover:text-red-800"
                >
                  Delete
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Link
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLinks.map((link) => (
              <tr key={link.code} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <RouterLink to={`/code/${link.code}`} className="text-sm font-bold text-primary-600 hover:text-primary-900">
                      /{link.code}
                    </RouterLink>
                    <button
                      onClick={() => copyToClipboard(link.code)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                      title="Copy Link"
                    >
                       {copiedCode === link.code ? (
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate" title={link.originalUrl}>
                    {link.originalUrl}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {link.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <RouterLink to={`/code/${link.code}`} className="text-primary-600 hover:text-primary-900">
                        Stats
                    </RouterLink>
                    <button
                        onClick={() => { if(window.confirm('Delete this link?')) onDelete(link.code); }}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};