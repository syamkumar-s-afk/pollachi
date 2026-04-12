import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Checks if a JWT token is expired by decoding its payload.
 * Returns true if expired or malformed.
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false; // No expiry claim — treat as valid

    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Auth guard for admin routes.
 * Checks for a valid, non-expired JWT in localStorage.
 * Redirects to /admin (login form) if invalid.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

export { isTokenExpired };
