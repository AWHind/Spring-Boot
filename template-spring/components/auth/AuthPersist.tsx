'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { User } from '@/lib/types';

export const AuthPersist: React.FC = () => {
  const { user, setUser } = useAuth();
  const [isHydrated, setIsHydrated] = React.useState(false);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user');
        localStorage.removeItem('user');
      }
    }
    setIsHydrated(true);
  }, []);

  return null;
};
