'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

interface AuthFormProps {
  type: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();
  const { login, register, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Minimum 6 characters';
    }
    
    if (type === 'register') {
      if (!formData.name) {
        errors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirmation is required';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (type === 'login') {
        const user = await login(formData.email, formData.password);
        // Redirect based on user role - admin goes to dashboard, clients go to menu
        const redirectPath = user?.role === 'admin' ? '/admin/dashboard' : '/client/menu';
        router.push(redirectPath);
      } else {
        await register(formData.email, formData.name, formData.password);
        // New registrations are always clients
        router.push('/client/menu');
      }
    } catch {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {type === 'register' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
             Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
              validationErrors.name ? 'border-destructive' : 'border-border'
            }`}

          />
          {validationErrors.name && (
            <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
            validationErrors.email ? 'border-destructive' : 'border-border'
          }`}

        />
        {validationErrors.email && (
          <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
            validationErrors.password ? 'border-destructive' : 'border-border'
          }`}

        />
        {validationErrors.password && (
          <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>
        )}
      </div>

      {type === 'register' && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
              validationErrors.confirmPassword ? 'border-destructive' : 'border-border'
            }`}

          />
          {validationErrors.confirmPassword && (
            <p className="text-xs text-destructive mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:shadow-lg hover:shadow-primary/50"
      >
        {isLoading ? 'Loading...' : type === 'login' ? 'Se Connecter' : 'Create Account'}
      </button>

      <p className="text-sm text-center text-muted-foreground">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              S’inscrire
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Se Connecter
            </Link>
          </>
        )}
      </p>
    </form>
  );
};
