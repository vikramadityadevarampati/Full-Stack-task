import React, { useState, useEffect, useCallback } from 'react';
import { CreateLinkForm } from './CreateLinkForm';
import { LinkList } from './LinkList';
import { Link } from '../types';
import * as storageService from '../services/storage';

const Dashboard: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const response = await storageService.getLinks();
      if (response.data) {
        setLinks(response.data);
      } else {
        setError('Failed to fetch links');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleLinkCreated = (newLink: Link) => {
    // Optimistic update or refetch
    setLinks(prev => [newLink, ...prev]);
  };

  const handleLinkDeleted = async (code: string) => {
    try {
      await storageService.deleteLink(code);
      setLinks(prev => prev.filter(link => link.code !== code));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete link");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Create New Link</h2>
            <p className="text-gray-500 text-sm mt-1">Shorten your long URLs and track their performance.</p>
        </div>
        <CreateLinkForm onSuccess={handleLinkCreated} />
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Your Links</h2>
          <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {links.length} Total
          </span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading your links...</p>
          </div>
        ) : error ? (
           <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <LinkList links={links} onDelete={handleLinkDeleted} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;