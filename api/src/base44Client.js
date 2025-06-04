import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "683f93beedc7948188d3c47b", 
  requiresAuth: true // Ensure authentication is required for all operations
});
