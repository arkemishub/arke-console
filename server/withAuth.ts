import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getToken } from "next-auth/jwt";
import { getClient } from "@/arke/getClient";
import { getSession } from "next-auth/react";
import { acceptedRoles as defaultAcceptedRoles } from "@/arke/config";

export function withAuth<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  acceptedRoles: string[] = defaultAcceptedRoles,
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return async function nextGetServerSidePropsHandlerWrappedWithLoggedInRedirect(
    context: GetServerSidePropsContext
  ) {
    const session = await getSession(context);
    const userRole = session?.user?.arke_id;

    if (!session)
      return {
        redirect: {
          destination: `/login`,
          permanent: false,
        },
      };

    if (userRole && !acceptedRoles.includes(userRole)) {
      return {
        redirect: {
          destination: `/404`,
          permanent: false,
        },
      };
    }

    return handler(context);
  };
}
