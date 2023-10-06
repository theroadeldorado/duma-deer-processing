'use client';
import useFirebaseLogout from '@/hooks/useFirebaseLogout';
import { useEffect } from 'react';

export default function Logout() {
  const { logout } = useFirebaseLogout();

  useEffect(() => {
    logout();
  }, []);

  return null;
}
