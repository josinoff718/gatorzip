import React, { useState } from 'react';
import { User } from '@/api/entities';

export default function UserDataTestPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await User.me();
      console.log("User data fetched:", user);
      setUserData(user);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>User Data Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchUserData}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#0021A5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Fetch User Data'}
        </button>
      </div>
      
      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {userData && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>User Data</h2>
          
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}