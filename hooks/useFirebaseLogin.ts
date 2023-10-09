import { auth } from 'lib/firebase';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import toast from 'react-hot-toast';
import { initSession } from '@/providers/UserProvider';

export default function useFirebaseLogin() {
  const login = async (email: string, password: string, disableLoader = false) => {
    const toastId = disableLoader ? undefined : toast.loading('Logging in...');
    try {
      if (!email || !password) {
        // Handle anonymous login here
        const response = await signInAnonymously(auth);
        const token = await response.user.getIdToken();
        const init = await initSession(token);
        if (init) {
          if (!disableLoader) toast.success('Success');
          return true;
        }
      } else {
        const response = await signInWithEmailAndPassword(auth, email, password);
        const token = await response.user.getIdToken();
        const init = await initSession(token);
        if (init) {
          if (!disableLoader) toast.success('Success');
          return true;
        }
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Invalid password');
      } else {
        toast.error('Error logging in');
      }
    } finally {
      if (!disableLoader) toast.dismiss(toastId);
    }
  };

  return { login };
}
