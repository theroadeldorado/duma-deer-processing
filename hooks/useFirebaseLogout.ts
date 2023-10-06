'use client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function useFirebaseLogout() {
  const router = useRouter();
  const logout = async () => {
    const toastId = toast.loading('Logging out...');

    try {
      await fetch('/api/auth/logout', {
        method: 'get',
      });
      await signOut(auth);
      router.push('/');
    } catch (error) {
      throw new Error('Error logging out');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return { logout };
}
