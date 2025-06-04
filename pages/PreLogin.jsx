import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PreLoginPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | processing | success

  const handleReturnHome = () => {
    setStatus('processing');
    try {
      localStorage.removeItem('userType');
      sessionStorage.clear();

      setTimeout(() => {
        setStatus('success');

        setTimeout(() => {
          navigate(createPageUrl("Home"));
        }, 1000); // Redirect shortly after showing success
      }, 1200);
    } catch (error) {
      console.error("Error clearing storage:", error);
      navigate(createPageUrl("Home"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 transition-all duration-500 ease-in-out">
      <div 
        className={`transform transition-opacity duration-700 ${
          status === 'success' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Ready to Continue?</h1>
        <p className="text-gray-600 mb-6 text-center">
          If you encountered an issue, you can return to the home page and try again.
        </p>
        <button 
          onClick={handleReturnHome}
          disabled={status === 'processing'}
          className={`flex items-center justify-center font-bold py-2 px-6 rounded transition-all ${
            status === 'processing'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {status === 'processing' ? (
            <>
              <svg 
                className="animate-spin h-4 w-4 mr-2 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            'Return to Home'
          )}
        </button>
      </div>

      {status === 'success' && (
        <div className="transition-opacity duration-700 opacity-100 scale-100 text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">✅ Success!</h1>
          <p className="text-gray-600">
            Redirecting you to the home page...
          </p>
        </div>
      )}
    </div>
  );
}