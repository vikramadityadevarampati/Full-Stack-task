import React, { useState } from 'react';
import { Link } from '../types';
import * as storageService from '../services/storage';

interface CreateLinkFormProps {
  onSuccess: (link: Link) => void;
}

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomCode, setShowCustomCode] = useState(false);

  // URL Validation Regex
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  
  // Code Validation Regex: [A-Za-z0-9]{6,8}
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate URL
    if (!url) {
        setError("URL is required.");
        return;
    }
    // Basic protocol prepend if missing
    let finalUrl = url;
    if (!/^https?:\/\//i.test(url)) {
        finalUrl = 'https://' + url;
    }

    if (!urlRegex.test(finalUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    // 2. Validate Code if present
    if (code) {
      if (!codeRegex.test(code)) {
        setError("Custom code must be 6-8 alphanumeric characters.");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await storageService.createLink({ url: finalUrl, code: code || undefined });
      
      if (result.status === 201 && result.data) {
        onSuccess(result.data);
        // Reset form
        setUrl('');
        setCode('');
        setShowCustomCode(false);
      } else {
        setError(result.error || "Failed to create link.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Destination URL
        </label>
        <div className="relative rounded-md shadow-sm">
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/my-long-article"
            className={`block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4 border ${error && !url ? 'border-red-500' : ''}`}
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
            {!showCustomCode ? (
                <button 
                    type="button" 
                    onClick={() => setShowCustomCode(true)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    + Add custom alias (optional)
                </button>
            ) : (
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Custom Alias
                </label>
            )}
        </div>
        
        {showCustomCode && (
            <div className="relative rounded-md shadow-sm transition-all duration-300 ease-in-out">
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. summer24 (6-8 chars)"
                    maxLength={8}
                    className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4 border"
                    disabled={loading}
                />
                 <p className="mt-1 text-xs text-gray-500">Leave empty to auto-generate.</p>
            </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
               <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
            </span>
          ) : 'Create Short Link'}
        </button>
      </div>
    </form>
  );
};