'use client';
import React from 'react';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from 'lib/firebase';
import toast from 'react-hot-toast';

type User = {
  role?: string;
  profileId?: string;
  uid?: string;
  [key: string]: any;
};

type Context = User & {};

export const UserContext = React.createContext<Context>({ user: {} });

type Props = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<User>({});

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
    });
    onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser({});
        return;
      }
      const result = await user.getIdTokenResult();
      const claims = result.claims;
      const role = claims.role;
      const profileId = claims.profileId;
      setUser((prev) => ({ ...prev, role, profileId }));
      initSession(result.token);
    });
  }, []);

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const { user, ...state } = React.useContext(UserContext);
  return { ...user, ...state };
};

const initSession = async (token?: any) => {
  const idToken = token || (await auth.currentUser?.getIdToken(true));
  const init = await fetch('/api/auth/init', {
    method: 'post',
    headers: {
      Authorization: idToken || '',
      'Content-Type': 'application/json',
    },
  });
  const initResult = await init.json();
  if (!initResult.success) {
    toast.error('Unable to initialize session');
    return;
  }
  return true;
};

export { UserProvider, useUser, initSession };
