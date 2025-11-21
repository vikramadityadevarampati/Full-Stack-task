import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as storageService from '../services/storage';

const RedirectHandler: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const performRedirect = async () => {
      if (!code) {
        setError('Invalid code');
        return;
      }

      try {
        const response = await storageService.recordClick(code);
        
        if (response.status === 200 && response.data) {
          // Perform the redirection
          window.location.href = response.data;
        } else {
          setError('Link not found');
          // In the requirements: "After deletion, /{code} must return 404".
          // We are client side, so we stay here and show 404.
        }
      } catch (err) {
        setError('System error');
      }
    };

    performRedirect();
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">404 Not Found</h2>
            <p className="text-gray-600 mb-6">The link you are trying to access does not exist or has been deleted.</p>
            <button 
                onClick={() => navigate('/')}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
            >
                Go to Homepage
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Redirecting...</h2>
            <p className="text-gray-500 mt-2">You are being sent to the destination.</p>
        </div>
    </div>
  );
};

export default RedirectHandler;