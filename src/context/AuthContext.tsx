// context/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ApiClient from '@/utils/api';

interface Admin {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const adminData = localStorage.getItem('admin');
        const token = localStorage.getItem('adminToken');
        
        console.log('Loading admin data:', { adminData: !!adminData, token: !!token });
        
        if (adminData && token) {
          const parsedAdmin = JSON.parse(adminData);
          setAdmin(parsedAdmin);
          
          // Skip token verification for now since /admin/profile doesn't exist
          // You can add this back when you have a token verification endpoint
          console.log('Admin data loaded from localStorage');
        } else {
          console.log('No admin data or token found');
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
        // Clear potentially corrupted data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await ApiClient.post('/admin/login', {
        email: email.trim().toLowerCase(),
        password
      });
      
      console.log('Login response:', response.status);
      
      const { token, admin: adminData } = response.data;
      
      console.log('Login response data:', { token: !!token, adminData });
      
      if (!token || !adminData) {
        throw new Error('Invalid response from server - missing token or admin data');
      }
      
      // Ensure admin has required properties
      if (!adminData.id && !adminData._id) {
        console.warn('Admin data missing ID:', adminData);
        // Add _id if missing but other data exists
        adminData.id = adminData._id || `temp_${Date.now()}`;
      }
      
      // Store the token (make sure it has Bearer prefix if needed)
      const tokenToStore = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      localStorage.setItem('adminToken', tokenToStore);
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);
      
      console.log('Login successful, admin set:', adminData);
      
      // Redirect to dashboard or intended page
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error; // Re-throw to handle in the component
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        console.log('Calling logout API...');
        // Let ApiClient handle the Authorization header automatically
        await ApiClient.post('/admin/logout');
        console.log('Logout API call successful');
      }
    } catch (error: any) {
      console.error('Logout API error:', error.response?.status, error.message);
      // Even if API call fails, we still want to clear local storage
    } finally {
      console.log('Clearing local storage and redirecting...');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      setAdmin(null);
      router.push('/login'); // Changed from '/' to '/login'
    }
  };

  return (
    <AuthContext.Provider value={{ 
      admin, 
      login, 
      logout, 
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}