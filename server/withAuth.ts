/*
 * Copyright 2023 Arkemis S.r.l.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
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
