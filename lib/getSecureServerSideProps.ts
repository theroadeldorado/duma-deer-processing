import { GetServerSidePropsContext } from 'next';
import { auth } from '@/lib/firebaseAdmin';
import nookies from 'nookies';
import { RoleType } from 'lib/enums';
import { SessionDataT } from '@/lib/types';

export default function getSecureServerSideProps(
  callback: (context: GetServerSidePropsContext, session: SessionDataT) => void,
  requireAdmin?: boolean
) {
  return async (context: GetServerSidePropsContext) => {
    const cookies = nookies.get(context);
    const redirectUrl = context.req.url?.startsWith('/_next') ? '/' : context.req.url;

    let session = null;
    try {
      session = await auth.verifySessionCookie(cookies.session);
    } catch (error) {
      return {
        redirect: {
          permanent: false,
          destination: `/login?redirect=${redirectUrl}`,
        },
      };
    }

    if (requireAdmin && session.role !== RoleType.ADMIN) {
      return {
        redirect: {
          permanent: false,
          destination: `/login?redirect=${redirectUrl}&unauthorized=true`,
        },
      };
    }

    // Callback might be async
    return await callback(context, { ...session, isAdmin: session.role === RoleType.ADMIN });
  };
}
