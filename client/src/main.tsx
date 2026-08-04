import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from './services/api';
import { useComplianceStore } from './store/useComplianceStore';
import { api } from './services/api';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient();

/**
 * AuthBridge: wires Clerk's getToken() into the API layer and loads the user profile.
 * Must be rendered inside ClerkProvider.
 */
function AuthBridge({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, userId } = useAuth();
  const { setIsAuthenticated, setSubscriptionStatus, setUserProfile } = useComplianceStore();

  useEffect(() => {
    // Register the Clerk token getter so axios interceptor can attach it
    setAuthTokenGetter(() => getToken());
  }, [getToken]);

  useEffect(() => {
    if (isSignedIn) {
      setIsAuthenticated(true);
      // Load user profile (includes subscription_status) from server
      api.fetchProfile().then((profile) => {
        if (profile) {
          setSubscriptionStatus(profile.subscription_status || 'free');
          setUserProfile({
            id: userId || '',
            email: profile.email || '',
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            companyName: profile.company_name || '',
            industry: profile.industry || '',
            teamSize: profile.team_size || '',
            cloudProvider: profile.cloud_provider || '',
            subscriptionStatus: profile.subscription_status || 'free',
          });
        }
      });
    } else {
      setIsAuthenticated(false);
      setSubscriptionStatus('free');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId]);

  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <QueryClientProvider client={queryClient}>
          <AuthBridge>
            <App />
          </AuthBridge>
        </QueryClientProvider>
      </ClerkProvider>
    ) : (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )}
  </React.StrictMode>
);
