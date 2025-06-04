import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function LogoutPage() {
  const navigate = useNavigate();
  
  // Simple redirect to home with no auth logic
  React.useEffect(() => {
    navigate(createPageUrl("Home"));
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to Home...</p>
    </div>
  );
}