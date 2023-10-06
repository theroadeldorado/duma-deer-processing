import React from 'react';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from 'lib/firebase';
import toast from 'react-hot-toast';
import { RoleType } from '@/lib/enums';
import { SessionDataT } from '@/lib/types';

type Props = {
  children: React.ReactNode;
};

const defaultUser = {
  isAdmin: false,
};

export const UserContext = React.createContext<SessionDataT>(defaultUser);

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<SessionDataT>(defaultUser);

  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser({ ...(user as any), isAdmin: false, name: user?.displayName }); // Custom claims are retrieved by onIdTokenChanged
    });
    onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setUser(defaultUser);
        return;
      }
      const result = await user.getIdTokenResult();
      const claims = result.claims;
      const role = claims.role;
      const isAdmin = !!(role === RoleType.ADMIN);
      const profileId = claims.profileId;
      setUser((prev) => ({ ...prev, role, profileId, isAdmin }));
      initSession(result.token);
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

const useUser = () => {
  return React.useContext(UserContext);
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
